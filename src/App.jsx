import { useState, useEffect } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import CurrentWeatherCard from './components/CurrentWeatherCard'
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
import { fetchWeatherData, fetchForecastData, fetchAirQuality } from './api/weatherApi'
import { Cloud, MapPin, Settings, RefreshCw, Star, BarChart3 } from 'lucide-react'

function App() {
  const [city, setCity] = useState('London')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [aqi, setAqi] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState(() => localStorage.getItem('temperatureUnit') || 'metric')
  const [showAlerts, setShowAlerts] = useState(() => {
    const saved = localStorage.getItem('showAlerts')
    return saved === null ? true : JSON.parse(saved)
  })
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'cards')
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto')
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches')
    return saved ? JSON.parse(saved) : []
  })
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteSearches')
    return saved ? JSON.parse(saved) : []
  })
  const [isFavorited, setIsFavorited] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  // Save preferences
  useEffect(() => { localStorage.setItem('temperatureUnit', unit) }, [unit])
  useEffect(() => { localStorage.setItem('showAlerts', JSON.stringify(showAlerts)) }, [showAlerts])
  useEffect(() => { localStorage.setItem('viewMode', viewMode) }, [viewMode])
  useEffect(() => { localStorage.setItem('theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('recentSearches', JSON.stringify(recentSearches)) }, [recentSearches])
  useEffect(() => { localStorage.setItem('favoriteSearches', JSON.stringify(favorites)) }, [favorites])

  useEffect(() => {
    loadWeatherData(city)
    setIsFavorited(favorites.includes(city))
  }, [])

  const loadWeatherData = async (searchCity) => {
    setLoading(true)
    setError(null)
    try {
      const weather = await fetchWeatherData(searchCity, unit)
      setCurrentWeather(weather)
      setCity(searchCity)
      setIsFavorited(favorites.includes(searchCity))
      const airQuality = await fetchAirQuality(weather.coord.lat, weather.coord.lon)
      setAqi(airQuality)
      setRecentSearches((prev) => {
        const filtered = prev.filter(c => c !== searchCity)
        return [searchCity, ...filtered].slice(0, 10)
      })
      const forecast = await fetchForecastData(searchCity, unit)
      setForecastData(forecast)
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchCity) => {
    if (searchCity.trim()) loadWeatherData(searchCity)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadWeatherData(city)
    setRefreshing(false)
  }

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavorites(favorites.filter(c => c !== city))
    } else {
      setFavorites([...favorites, city])
    }
    setIsFavorited(!isFavorited)
  }

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>

      {/* ===== HEADER ===== */}
      <header className="glass-panel sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0 animate-slide-down">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f8bff 0%, #22d3ee 100%)' }}>
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block text-gradient-blue">Nimbus</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0 animate-slide-down">
            {currentWeather && (
              <>
                <button
                  onClick={handleRefresh}
                  className={`p-2.5 rounded-xl hover:bg-white/5 transition-all ${refreshing ? 'animate-spin-slow' : ''}`}
                  title="Refresh"
                >
                  <RefreshCw className="w-4.5 h-4.5 text-gray-400 hover:text-white transition-colors" />
                </button>

                <button
                  onClick={() => setShowComparison(true)}
                  className="p-2.5 rounded-xl hover:bg-white/5 transition-all"
                  title="Compare cities"
                >
                  <BarChart3 className="w-4.5 h-4.5 text-gray-400 hover:text-white transition-colors" />
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`p-2.5 rounded-xl transition-all ${isFavorited ? 'bg-amber-500/10 text-amber-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                  title={isFavorited ? 'Remove favorite' : 'Add favorite'}
                >
                  <Star className="w-4.5 h-4.5" fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
              </>
            )}

            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'map' : 'cards')}
              className="p-2.5 rounded-xl hover:bg-white/5 transition-all"
              title="Toggle view"
            >
              <MapPin className="w-4.5 h-4.5 text-gray-400 hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
              className="px-3 py-1.5 rounded-xl glass-card text-sm font-semibold tracking-wide"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              °{unit === 'metric' ? 'C' : 'F'}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-xl hover:bg-white/5 transition-all"
              title="Settings"
            >
              <Settings className="w-4.5 h-4.5 text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      {currentWeather && (
        <section className="animate-slide-down max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(79,139,255,0.15)', color: '#4f8bff', border: '1px solid rgba(79,139,255,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse-glow"></span>
                  Live
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter text-glow leading-none">
                {city}
              </h2>
              <p className="text-lg text-gray-400 mt-2 capitalize font-medium">
                {currentWeather?.weather?.[0]?.description ?? ''}
              </p>
            </div>

            <div className="glass-panel px-5 py-2.5 rounded-2xl flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Updated</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {new Date(currentWeather.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-16">

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl animate-slide-down flex items-center gap-3"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <span className="text-xl">⚠️</span>
            <span className="text-red-200 font-medium text-sm">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && !currentWeather ? (
          <LoadingSkeleton />
        ) : currentWeather ? (
          <>
            {/* Alerts */}
            {showAlerts && (
              <div className="animate-slide-down mb-6">
                <AlertsBanner weather={currentWeather} />
              </div>
            )}

            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* === LEFT COLUMN (8 cols) === */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="animate-scale-in">
                    <CurrentWeatherCard data={currentWeather} unit={unit} city={city} />
                  </div>

                  {forecastData && (
                    <div className="animate-slide-up delay-100">
                      <HourlyForecastCarousel data={forecastData.list.slice(0, 8)} unit={unit} />
                    </div>
                  )}

                  {forecastData && (
                    <div className="animate-scale-in delay-200">
                      <TemperatureTrends data={forecastData} unit={unit} />
                    </div>
                  )}
                </div>

                {/* === RIGHT COLUMN (4 cols) === */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="animate-scale-in delay-100">
                    <EnhancedDetails data={currentWeather} unit={unit} city={city} forecastData={forecastData} />
                  </div>

                  {forecastData && (
                    <div className="animate-slide-up delay-200">
                      <WeeklyForecast data={forecastData} unit={unit} />
                    </div>
                  )}

                  {aqi && (
                    <div className="animate-scale-in delay-300">
                      <AirQualityIndex aqi={aqi} />
                    </div>
                  )}

                  <div className="animate-scale-in delay-400">
                    <DetailedWeather data={currentWeather} unit={unit} />
                  </div>

                  <div className="animate-scale-in delay-500">
                    <RecentSearches onSelect={handleSearch} recentSearches={recentSearches} favorites={favorites} />
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
      <footer className="glass-panel mt-auto py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 text-xs font-medium tracking-wide">
            Nimbus Weather · Powered by OpenWeatherMap
          </p>
          {currentWeather && (
            <p className="text-gray-600 text-[10px] mt-1 tabular-nums">
              Last sync: {new Date(currentWeather.dt * 1000).toLocaleTimeString()}
            </p>
          )}
        </div>
      </footer>

      {/* Modals */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        unit={unit}
        onUnitChange={setUnit}
        showAlerts={showAlerts}
        onAlertsChange={setShowAlerts}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        theme={theme}
        onThemeChange={setTheme}
      />

      <ComparisonView
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        currentCity={city}
        currentWeather={currentWeather}
        unit={unit}
        onLoadCity={async (searchCity) => {
          const weather = await fetchWeatherData(searchCity, unit)
          return weather
        }}
      />
    </div>
  )
}

export default App
