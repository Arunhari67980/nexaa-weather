import { useState, useEffect, useRef, Component } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import DetailedWeather from './components/DetailedWeather'
import HourlyForecastCarousel from './components/HourlyForecastCarousel'
import WeeklyForecast from './components/WeeklyForecast'
import AlertsBanner from './components/AlertsBanner'
import MapView from './components/MapView'
import SettingsPanel from './components/SettingsPanel'
import RecentSearches from './components/RecentSearches'
import LoadingSkeleton from './components/LoadingSkeleton'
import EnhancedDetails from './components/EnhancedDetails'
import TemperatureTrends from './components/TemperatureTrends'
import AirQualityIndex from './components/AirQualityIndex'
import ComparisonView from './components/ComparisonView'
import AtmosphericEngine from './components/AtmosphericEngine'
import WeatherDock from './components/WeatherDock'
import CursorGlow from './components/CursorGlow'
import TiltCard from './components/TiltCard'
import { initSmoothScroll, destroySmoothScroll } from './utils/smoothScroll'
import {
  fetchWeatherData,
  fetchForecastData,
  fetchAirQuality,
  getWeatherIcon,
  getFallbackWeatherData,
  getFallbackForecastData,
  getFallbackAirQuality,
} from './api/weatherApi'
import { Cloud, MapPin, Settings, RefreshCw, Star, ArrowUpDown } from 'lucide-react'

// Error Boundary to prevent blank-screen unmounting under any edge case
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Dashboard error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#100b14] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-white/10 space-y-4">
            <span className="text-4xl">🌤️</span>
            <h2 className="text-xl font-bold font-mono">Restoring Atmospheric Telemetry</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              An unexpected interface disturbance was caught. Click below to reset to clean defaults.
            </p>
            {this.state.error && (
              <p className="text-[10px] font-mono text-red-400/80 bg-red-950/40 p-2 rounded-lg break-all">
                {this.state.error.message || String(this.state.error)}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
              >
                Retry
              </button>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-lg"
              >
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const seasonAccents = {
  autumn: '#f0a352',
  winter: '#38bdf8',
  spring: '#f472b6',
  summer: '#fbbf24',
  storm: '#818cf8',
}

function WeatherApp() {
  const [city, setCity] = useState('London')
  const [unit, setUnit] = useState(() => localStorage.getItem('temperatureUnit') || 'metric')
  const [windUnit, setWindUnit] = useState(() => localStorage.getItem('windUnit') || 'm/s')
  const [pressureUnit, setPressureUnit] = useState(() => localStorage.getItem('pressureUnit') || 'mb')
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(
    () => localStorage.getItem('autoRefreshInterval') || 'off'
  )

  // Instant zero-lag state initialization using resilient fallback data (0ms initial load)
  const [currentWeather, setCurrentWeather] = useState(() => getFallbackWeatherData('London', unit))
  const [forecastData, setForecastData] = useState(() => getFallbackForecastData('London', unit))
  const [aqi, setAqi] = useState(() => getFallbackAirQuality())

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [showAlerts, setShowAlerts] = useState(() => {
    const saved = localStorage.getItem('showAlerts')
    return saved === null ? true : JSON.parse(saved)
  })

  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'cards')
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto')

  const [displayOptions, setDisplayOptions] = useState(() => {
    const saved = localStorage.getItem('displayOptions')
    return saved
      ? JSON.parse(saved)
      : {
          showWind: true,
          showHumidity: true,
          showPressure: true,
          showVisibility: true,
          showAqi: true,
          showHourly: true,
          showWeekly: true,
          showTrends: true,
          showEnhanced: true,
          animationIntensity: 'full', // 'full' | 'minimal' | 'off'
        }
  })

  const [alertSettings, setAlertSettings] = useState(() => {
    const saved = localStorage.getItem('alertSettings')
    return saved
      ? JSON.parse(saved)
      : {
          freeze: true,
          wind: true,
          rain: true,
          heat: true,
          visibility: true,
        }
  })

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches')
    return saved ? JSON.parse(saved) : ['London', 'Tokyo', 'New York', 'Paris']
  })

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteSearches')
    return saved ? JSON.parse(saved) : ['London']
  })

  const [isFavorited, setIsFavorited] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  // Atmospheric Engine States (Default strictly Spring per requirements)
  const [season, setSeason] = useState('spring')
  const [windSpeed, setWindSpeed] = useState('brisk')
  const [isAutoSync, setIsAutoSync] = useState(true)
  const hasUserSelectedLocation = useRef(false)
  const isFirstUnitMount = useRef(true)
  const atmosphericRef = useRef(null)

  const speedUnit = windUnit || (unit === 'metric' ? 'm/s' : 'mph')
  const activeAccent = seasonAccents[season] || '#f472b6'

  // Initialize smooth scroll (Desktop only - native smooth scrolling on mobile)
  useEffect(() => {
    initSmoothScroll()
    return () => {
      destroySmoothScroll()
    }
  }, [])

  // Sync data-season on root html element
  useEffect(() => {
    document.documentElement.setAttribute('data-season', season)
  }, [season])

  // Save preferences to localStorage
  useEffect(() => { localStorage.setItem('temperatureUnit', unit) }, [unit])
  useEffect(() => { localStorage.setItem('windUnit', windUnit) }, [windUnit])
  useEffect(() => { localStorage.setItem('pressureUnit', pressureUnit) }, [pressureUnit])
  useEffect(() => { localStorage.setItem('showAlerts', JSON.stringify(showAlerts)) }, [showAlerts])
  useEffect(() => { localStorage.setItem('displayOptions', JSON.stringify(displayOptions)) }, [displayOptions])
  useEffect(() => { localStorage.setItem('alertSettings', JSON.stringify(alertSettings)) }, [alertSettings])
  useEffect(() => { localStorage.setItem('autoRefreshInterval', autoRefreshInterval) }, [autoRefreshInterval])
  useEffect(() => { localStorage.setItem('viewMode', viewMode) }, [viewMode])
  useEffect(() => { localStorage.setItem('theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('recentSearches', JSON.stringify(recentSearches)) }, [recentSearches])
  useEffect(() => { localStorage.setItem('favoriteSearches', JSON.stringify(favorites)) }, [favorites])

  // Re-fetch when unit changes
  useEffect(() => {
    if (isFirstUnitMount.current) {
      isFirstUnitMount.current = false
      return
    }
    loadWeatherData(city, hasUserSelectedLocation.current)
  }, [unit])

  // Auto-refresh interval listener
  useEffect(() => {
    if (autoRefreshInterval === 'off') return

    const intervals = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
    }

    const ms = intervals[autoRefreshInterval] || 15 * 60 * 1000
    const timer = setInterval(() => {
      loadWeatherData(city, hasUserSelectedLocation.current)
    }, ms)

    return () => clearInterval(timer)
  }, [autoRefreshInterval, city, unit])

  // Determine season automatically from weather telemetry
  const determineSeason = (weatherData, currentUnit) => {
    if (!weatherData) return 'spring'
    const main = weatherData.weather?.[0]?.main?.toLowerCase() || ''
    const desc = weatherData.weather?.[0]?.description?.toLowerCase() || ''
    const temp = weatherData.main?.temp
    const tempC = currentUnit === 'metric' ? temp : ((temp - 32) * 5) / 9

    if (main.includes('snow') || desc.includes('snow') || tempC <= 1) {
      return 'winter'
    }
    if (main.includes('thunder') || main.includes('storm') || main.includes('rain') || main.includes('drizzle')) {
      return 'storm'
    }
    if (tempC >= 23 || (main.includes('clear') && tempC >= 20)) {
      return 'summer'
    }
    if (tempC >= 12 && tempC < 23) {
      return 'spring'
    }
    return 'autumn'
  }

  // Fast Parallel Telemetry Loader
  const loadWeatherData = async (searchCity, isUserSelection = false) => {
    setLoading(true)
    setError(null)

    try {
      // Parallel concurrent execution with Promise.allSettled for instant response
      const [weatherResult, forecastResult] = await Promise.allSettled([
        fetchWeatherData(searchCity, unit),
        fetchForecastData(searchCity, unit),
      ])

      const weather =
        weatherResult.status === 'fulfilled' && weatherResult.value
          ? weatherResult.value
          : getFallbackWeatherData(searchCity, unit)

      setCurrentWeather(weather)
      setCity(searchCity)
      setIsFavorited(favorites.includes(searchCity))

      // Keep spring as default season when user visits the site.
      // Once the user selects a location, automatically transition season to that location's weather.
      if (isUserSelection) {
        hasUserSelectedLocation.current = true
        if (isAutoSync) {
          const detected = determineSeason(weather, unit)
          setSeason(detected)
        }
      } else if (!hasUserSelectedLocation.current) {
        // Enforce Spring as default on initial site visit
        setSeason('spring')
      } else if (isAutoSync) {
        const detected = determineSeason(weather, unit)
        setSeason(detected)
      }

      setRecentSearches((prev) => {
        const filtered = prev.filter((c) => c !== searchCity)
        return [searchCity, ...filtered].slice(0, 10)
      })

      const forecast =
        forecastResult.status === 'fulfilled' && forecastResult.value
          ? forecastResult.value
          : getFallbackForecastData(searchCity, unit)
      setForecastData(forecast)

      // Fetch air pollution in background without blocking main dashboard
      if (weather.coord?.lat && weather.coord?.lon) {
        fetchAirQuality(weather.coord.lat, weather.coord.lon).then((airPollution) => {
          if (airPollution) setAqi(airPollution)
        })
      }
    } catch (err) {
      console.warn('Weather load notice:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial visit: background update while Spring remains default season
    loadWeatherData(city, false)
    setIsFavorited(favorites.includes(city))
  }, [])

  const handleSearch = (searchCity) => {
    if (searchCity && searchCity.trim()) {
      loadWeatherData(searchCity.trim(), true)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadWeatherData(city, hasUserSelectedLocation.current)
    setRefreshing(false)
  }

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavorites(favorites.filter((c) => c !== city))
    } else {
      setFavorites([...favorites, city])
    }
    setIsFavorited(!isFavorited)
  }

  const handleManualSeasonChange = (newSeason) => {
    setIsAutoSync(false)
    setSeason(newSeason)
  }

  const handleToggleAutoSync = () => {
    const next = !isAutoSync
    setIsAutoSync(next)
    if (next && currentWeather) {
      setSeason(determineSeason(currentWeather, unit))
    }
  }

  const triggerAtmosphericGust = (strength = 1.6) => {
    if (atmosphericRef.current) {
      atmosphericRef.current.triggerGust(strength)
    }
  }

  const particleDensity =
    displayOptions.animationIntensity === 'off'
      ? 0
      : displayOptions.animationIntensity === 'minimal'
      ? 0.4
      : 1.0

  return (
    <div
      data-season={season}
      className="min-h-screen text-white relative transition-colors duration-700 overflow-x-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Outfit', 'Space Grotesk', system-ui, sans-serif",
      }}
    >
      {/* Cinematic Multi-Season Particle Canvas Engine */}
      {displayOptions.animationIntensity !== 'off' && (
        <AtmosphericEngine
          ref={atmosphericRef}
          season={season}
          windSpeed={windSpeed}
          particleDensity={particleDensity}
          interactive={true}
        />
      )}

      {/* Interactive Cursor Spotlight (Desktop only) */}
      <CursorGlow accent={activeAccent} />

      {/* Floating Atmosphere Controller Dock */}
      <WeatherDock
        currentSeason={season}
        onSeasonChange={handleManualSeasonChange}
        windSpeed={windSpeed}
        onWindSpeedChange={setWindSpeed}
        onTriggerGust={triggerAtmosphericGust}
        isAutoSync={isAutoSync}
        onToggleAutoSync={handleToggleAutoSync}
      />

      {/* ===== HEADER NAVIGATION ===== */}
      <header className="glass-panel sticky top-0 z-40 border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5">
          {/* Desktop Navigation (sm and up) */}
          <div className="hidden sm:flex items-center justify-between gap-4 md:gap-6">
            {/* Brand Logo & Station Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div
                className="relative w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden group shadow-lg cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${activeAccent}, var(--theme-accent-secondary))`,
                  boxShadow: `0 0 20px ${activeAccent}40`,
                }}
                onClick={() => triggerAtmosphericGust(2.0)}
                title="Click to release wind gust"
              >
                <Cloud className="w-5 h-5 text-black transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold font-mono tracking-tight text-white">
                    NEXAA
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider"
                    style={{
                      background: `${activeAccent}25`,
                      color: activeAccent,
                      border: `1px solid ${activeAccent}40`,
                    }}
                  >
                    {season.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/40 tracking-wider">
                  Atmospheric Intelligence
                </span>
              </div>
            </div>

            {/* Desktop Search Bar with GPS Geolocation */}
            <div className="flex-1 max-w-sm md:max-w-md">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Desktop Action Icons */}
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              {currentWeather && (
                <>
                  <button
                    onClick={handleRefresh}
                    className={`p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all ${
                      refreshing ? 'animate-spin' : ''
                    }`}
                    title="Synchronize Live Telemetry"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-xl transition-all ${
                      isFavorited
                        ? 'text-amber-400 bg-amber-400/15 border border-amber-400/30'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                    title={isFavorited ? 'Remove Star' : 'Star Station'}
                  >
                    <Star className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={() => setShowComparison(true)}
                    className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    title="City Telemetry Comparison"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setViewMode(viewMode === 'cards' ? 'map' : 'cards')}
                    className={`p-2 rounded-xl transition-all ${
                      viewMode === 'map'
                        ? 'text-white bg-white/15 border border-white/20'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Radar Map Toggle"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
                className="px-3 py-1.5 rounded-xl glass-card text-xs font-mono font-bold hover:bg-white/10 transition-all border border-white/10"
                style={{ color: activeAccent }}
                title="Toggle Temperature Unit"
              >
                °{unit === 'metric' ? 'C' : 'F'}
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
                title="System Preferences & Customization"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation (under sm): Two clean, uncrowded tiers */}
          <div className="flex sm:hidden flex-col gap-2.5">
            {/* Mobile Tier 1: Logo, Brand + Quick Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${activeAccent}, var(--theme-accent-secondary))`,
                  }}
                  onClick={() => triggerAtmosphericGust(1.8)}
                >
                  <Cloud className="w-4.5 h-4.5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold font-mono text-white tracking-tight">
                      NEXAA
                    </span>
                    <span
                      className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        background: `${activeAccent}25`,
                        color: activeAccent,
                        border: `1px solid ${activeAccent}40`,
                      }}
                    >
                      {season.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="flex items-center gap-1">
                {currentWeather && (
                  <>
                    <button
                      onClick={handleRefresh}
                      className={`p-2 rounded-lg text-white/70 hover:text-white ${
                        refreshing ? 'animate-spin' : ''
                      }`}
                      title="Refresh"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-lg ${
                        isFavorited ? 'text-amber-400' : 'text-white/60'
                      }`}
                      title="Star"
                    >
                      <Star className="w-3.5 h-3.5" fill={isFavorited ? 'currentColor' : 'none'} />
                    </button>

                    <button
                      onClick={() => setShowComparison(true)}
                      className="p-2 rounded-lg text-white/60"
                      title="Compare"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setViewMode(viewMode === 'cards' ? 'map' : 'cards')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'map' ? 'text-white' : 'text-white/60'
                      }`}
                      title="Map"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
                  className="px-2 py-1 rounded-lg glass-card text-[11px] font-mono font-bold border border-white/10"
                  style={{ color: activeAccent }}
                >
                  °{unit === 'metric' ? 'C' : 'F'}
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-lg text-white/60"
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile Tier 2: Full-width search bar */}
            <div className="w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO TELEMETRY SECTION ===== */}
      {currentWeather && (
        <section className="relative overflow-hidden py-4 sm:py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
            <TiltCard
              accentColor={activeAccent}
              className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 overflow-hidden border border-white/15"
              style={{
                background: 'var(--theme-glass-bg)',
                boxShadow: `0 25px 70px -15px rgba(0,0,0,0.8), 0 0 50px ${activeAccent}18`,
              }}
            >
              {/* DESKTOP HERO VIEW (md and up) */}
              <div className="hidden md:grid md:grid-cols-12 gap-8 items-center">
                {/* Left 7 Columns: Weather Data */}
                <div className="md:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                      style={{
                        background: `${activeAccent}18`,
                        color: activeAccent,
                        border: `1px solid ${activeAccent}40`,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Station Live · {currentWeather.sys?.country || 'INTL'}
                    </span>

                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                      Telemetry Node #{currentWeather.id || '901'}
                    </span>
                  </div>

                  <div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white theme-text-glow leading-tight break-words mb-1.5">
                      {city}
                    </h1>
                    <p className="text-lg lg:text-xl text-white/70 capitalize font-medium">
                      {currentWeather?.weather?.[0]?.description ?? 'Clear Sky'}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <span className="text-7xl lg:text-8xl font-extrabold font-mono tracking-tighter text-white">
                      {Math.round(currentWeather.main?.temp ?? 20)}°
                    </span>
                    <div className="space-y-1 font-mono">
                      <p className="text-sm text-white/60">
                        Feels like{' '}
                        <span className="font-bold text-white">
                          {Math.round(currentWeather.main?.feels_like ?? 20)}°
                        </span>
                      </p>
                      <p className="text-xs text-white/40">
                        Peak: {Math.round(currentWeather.main?.temp_max ?? 22)}° · Floor:{' '}
                        {Math.round(currentWeather.main?.temp_min ?? 18)}°
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5 pt-1">
                    <QuickMetric
                      label="Moisture"
                      value={`${currentWeather.main?.humidity ?? 50}%`}
                      emoji="💧"
                    />
                    <QuickMetric
                      label="Wind"
                      value={`${(currentWeather.wind?.speed ?? 0).toFixed(1)} ${speedUnit}`}
                      emoji="💨"
                    />
                    <QuickMetric
                      label="Barometer"
                      value={`${currentWeather.main?.pressure ?? 1013} mb`}
                      emoji="🔽"
                    />
                    <QuickMetric
                      label="Visibility"
                      value={`${(((currentWeather.visibility ?? 10000) / 1000)).toFixed(1)} km`}
                      emoji="👁️"
                    />
                  </div>
                </div>

                {/* Right 5 Columns: Large Floating 3D Orb */}
                <div className="md:col-span-5 flex justify-center items-center">
                  <div className="relative w-60 h-60 lg:w-72 lg:h-72 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full blur-2xl pointer-events-none opacity-50"
                      style={{
                        background: `radial-gradient(circle, ${activeAccent}40 0%, transparent 70%)`,
                      }}
                    />
                    <div
                      className="absolute inset-2 rounded-full border border-dashed opacity-25 animate-spin pointer-events-none"
                      style={{
                        borderColor: activeAccent,
                        animationDuration: '24s',
                      }}
                    />
                    <div className="text-8xl lg:text-[130px] weather-icon-hero cursor-pointer transition-transform hover:scale-105">
                      {getWeatherIcon(currentWeather.weather?.[0]?.icon || '01d')}
                    </div>
                  </div>
                </div>
              </div>

              {/* MOBILE HERO VIEW (< md): Compact, punchy layout */}
              <div className="block md:hidden space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                    style={{
                      background: `${activeAccent}18`,
                      color: activeAccent,
                      border: `1px solid ${activeAccent}40`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live · {currentWeather.sys?.country || 'INTL'}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    LAT: {currentWeather.coord?.lat?.toFixed(1) || '0.0'}° · LON:{' '}
                    {currentWeather.coord?.lon?.toFixed(1) || '0.0'}°
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white theme-text-glow leading-tight break-words">
                    {city}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/70 capitalize font-medium">
                    {currentWeather?.weather?.[0]?.description ?? 'Clear Sky'}
                  </p>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tighter text-white">
                      {Math.round(currentWeather.main?.temp ?? 20)}°
                    </div>
                    <div className="space-y-0.5 font-mono text-xs text-white/60 mt-1">
                      <p>
                        Feels like{' '}
                        <span className="font-bold text-white">
                          {Math.round(currentWeather.main?.feels_like ?? 20)}°
                        </span>
                      </p>
                      <p className="text-[11px] text-white/40">
                        H: {Math.round(currentWeather.main?.temp_max ?? 22)}° · L:{' '}
                        {Math.round(currentWeather.main?.temp_min ?? 18)}°
                      </p>
                    </div>
                  </div>

                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
                    <div
                      className="absolute inset-0 rounded-full blur-xl pointer-events-none opacity-40"
                      style={{
                        background: `radial-gradient(circle, ${activeAccent}50 0%, transparent 70%)`,
                      }}
                    />
                    <div className="text-6xl sm:text-7xl weather-icon-hero">
                      {getWeatherIcon(currentWeather.weather?.[0]?.icon || '01d')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <QuickMetric
                    label="Moisture"
                    value={`${currentWeather.main?.humidity ?? 50}%`}
                    emoji="💧"
                  />
                  <QuickMetric
                    label="Wind Vector"
                    value={`${(currentWeather.wind?.speed ?? 0).toFixed(1)} ${speedUnit}`}
                    emoji="💨"
                  />
                  <QuickMetric
                    label="Barometer"
                    value={`${currentWeather.main?.pressure ?? 1013} mb`}
                    emoji="🔽"
                  />
                  <QuickMetric
                    label="Visibility"
                    value={`${(((currentWeather.visibility ?? 10000) / 1000)).toFixed(1)} km`}
                    emoji="👁️"
                  />
                </div>
              </div>
            </TiltCard>
          </div>
        </section>
      )}

      {/* ===== MAIN CONTENT GRID ===== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 pb-20">
        {/* Error Notification */}
        {error && (
          <div
            className="mb-6 p-4 sm:p-5 rounded-2xl sm:rounded-3xl glass-card border border-red-500/40 animate-slide-down"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <p className="text-red-300 font-mono text-xs sm:text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && !currentWeather ? (
          <LoadingSkeleton />
        ) : currentWeather ? (
          <>
            {/* Meteorological Advisories Banner */}
            {showAlerts && (
              <AlertsBanner weather={currentWeather} alertSettings={alertSettings} />
            )}

            {viewMode === 'cards' ? (
              <div className="space-y-6 sm:space-y-8">
                {/* 24-Hour Telemetry Carousel */}
                {displayOptions.showHourly !== false && forecastData && (
                  <HourlyForecastCarousel
                    data={forecastData.list.slice(0, 16)}
                    unit={unit}
                  />
                )}

                {/* Symmetrical High-Performance Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Column: Trajectories & Metrics */}
                  <div className="space-y-6 sm:space-y-8">
                    {displayOptions.showTrends !== false && forecastData && (
                      <TemperatureTrends data={forecastData} unit={unit} />
                    )}

                    <DetailedWeather
                      data={currentWeather}
                      unit={unit}
                      windUnit={windUnit}
                      pressureUnit={pressureUnit}
                    />

                    {displayOptions.showWeekly !== false && forecastData && (
                      <WeeklyForecast data={forecastData} unit={unit} />
                    )}
                  </div>

                  {/* Right Column: Tactical Intelligence, Air Purity, History */}
                  <div className="space-y-6 sm:space-y-8">
                    {displayOptions.showEnhanced !== false && (
                      <EnhancedDetails
                        data={currentWeather}
                        unit={unit}
                        city={city}
                        forecastData={forecastData}
                      />
                    )}

                    {displayOptions.showAqi !== false && aqi && (
                      <AirQualityIndex aqi={aqi} />
                    )}

                    <RecentSearches
                      onSelect={handleSearch}
                      recentSearches={recentSearches}
                      favorites={favorites}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <MapView data={currentWeather} city={city} />
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="glass-panel border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-mono text-white/40 text-center sm:text-left">
          <p>NEXAA Weather Intelligence · Real-Time Atmospheric Telemetry</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>OpenWeatherMap Global Mesh</span>
          </div>
        </div>
      </footer>

      {/* Settings Panel Modal with All Customization Options */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        unit={unit}
        onUnitChange={setUnit}
        windUnit={windUnit}
        onWindUnitChange={setWindUnit}
        pressureUnit={pressureUnit}
        onPressureUnitChange={setPressureUnit}
        showAlerts={showAlerts}
        onAlertsChange={setShowAlerts}
        alertSettings={alertSettings}
        onAlertSettingsChange={setAlertSettings}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        theme={theme}
        onThemeChange={setTheme}
        displayOptions={displayOptions}
        onDisplayOptionsChange={setDisplayOptions}
        autoRefreshInterval={autoRefreshInterval}
        onAutoRefreshChange={setAutoRefreshInterval}
      />

      {/* Comparison View Modal */}
      <ComparisonView
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        currentCity={city}
        currentWeather={currentWeather}
        unit={unit}
        onLoadCity={async (searchCity) => {
          return await fetchWeatherData(searchCity, unit)
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <WeatherApp />
    </ErrorBoundary>
  )
}

function QuickMetric({ label, value, emoji }) {
  return (
    <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 hover:border-white/15">
      <div className="flex items-center gap-1 mb-0.5 text-xs sm:text-sm">{emoji}</div>
      <p className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-white/40">
        {label}
      </p>
      <p className="text-xs sm:text-base font-bold font-mono text-white mt-0.5 truncate">{value}</p>
    </div>
  )
}
