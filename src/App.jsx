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
import { fetchWeatherData, fetchForecastData, fetchAirQuality, getWeatherIcon } from './api/weatherApi'
import { Cloud, MapPin, Settings, RefreshCw, Star } from 'lucide-react'

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
      {/* Animated background */}
      <div className="animated-background" />

      {/* ===== HEADER ===== */}
      <header className="glass-panel sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 animate-slide-down">
            <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              <Cloud className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 rounded-2xl" style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                animation: 'shimmer 3s infinite'
              }} />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base sm:text-lg font-bold text-white">Nimbus</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">Weather</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs sm:max-w-md">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {currentWeather && (
              <>
                <button
                  onClick={handleRefresh}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/5 transition-all ${refreshing ? 'animate-spin' : ''}`}
                  title="Refresh"
                >
                  <RefreshCw className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 hover:text-white" />
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${isFavorited ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <Star className="w-4 sm:w-5 h-4 sm:h-5" fill={isFavorited ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={() => setViewMode(viewMode === 'cards' ? 'map' : 'cards')}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/5 transition-all text-gray-400"
                >
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </>
            )}

            <button
              onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
              className="px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl glass-panel text-xs sm:text-sm font-semibold hover:bg-white/5 transition-all"
            >
              °{unit === 'metric' ? 'C' : 'F'}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/5 transition-all text-gray-400"
            >
              <Settings className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      {currentWeather && (
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              {/* Left: Weather Info */}
              <div className="animate-slide-up">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    Live Weather
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 text-glow">
                  {city}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 capitalize font-medium mb-6 sm:mb-8">
                  {currentWeather?.weather?.[0]?.description ?? 'Clear skies'}
                </p>
                
                <div className="flex items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-gradient-blue">
                    {Math.round(currentWeather.main.temp)}°
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-400">Feels like {Math.round(currentWeather.main.feels_like)}°</p>
                    <p className="text-sm text-gray-500">High: {Math.round(currentWeather.main.temp_max)}° / Low: {Math.round(currentWeather.main.temp_min)}°</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <QuickStat icon="💧" label="Humidity" value={`${currentWeather.main.humidity}%`} />
                  <QuickStat icon="💨" label="Wind" value={`${currentWeather.wind.speed.toFixed(1)} m/s`} />
                  <QuickStat icon="🔽" label="Pressure" value={`${currentWeather.main.pressure} mb`} />
                  <QuickStat icon="👁️" label="Visibility" value={`${(currentWeather.visibility / 1000).toFixed(1)} km`} />
                </div>
              </div>

              {/* Right: Large Weather Icon */}
              <div className="flex justify-center items-center animate-drift">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)`,
                      animation: 'pulse 4s ease-in-out infinite'
                    }} />
                  <div className="text-7xl sm:text-8xl md:text-9xl weather-icon-lg select-none">
                    {getWeatherIcon(currentWeather.weather[0].icon)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12 sm:pb-16 lg:pb-20">
        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-6 rounded-2xl glass-panel border border-red-500/30 animate-slide-down"
            style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
            <p className="text-red-300 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !currentWeather ? (
          <LoadingSkeleton />
        ) : currentWeather ? (
          <>
            {/* Alerts Banner */}
            {showAlerts && (
              <div className="animate-slide-down mb-8">
                <AlertsBanner weather={currentWeather} />
              </div>
            )}

            {viewMode === 'cards' ? (
              <div className="space-y-8">
                {/* Hourly Forecast */}
                {forecastData && (
                  <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
                    <HourlyForecastCarousel data={forecastData.list.slice(0, 12)} unit={unit} />
                  </div>
                )}

                {/* Main Grid - Balanced 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Temperature Trends */}
                    {forecastData && (
                      <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
                        <TemperatureTrends data={forecastData} unit={unit} />
                      </div>
                    )}

                    {/* Detailed Weather */}
                    <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
                      <DetailedWeather data={currentWeather} unit={unit} />
                    </div>

                    {/* Weekly Forecast */}
                    {forecastData && (
                      <div className="animate-scale-in" style={{ animationDelay: '400ms' }}>
                        <WeeklyForecast data={forecastData} unit={unit} />
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Enhanced Details */}
                    <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
                      <EnhancedDetails data={currentWeather} unit={unit} city={city} forecastData={forecastData} />
                    </div>

                    {/* Air Quality */}
                    {aqi && (
                      <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
                        <AirQualityIndex aqi={aqi} />
                      </div>
                    )}

                    {/* Recent Searches */}
                    <div className="animate-scale-in" style={{ animationDelay: '500ms' }}>
                      <RecentSearches onSelect={handleSearch} recentSearches={recentSearches} favorites={favorites} />
                    </div>
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
      <footer className="glass-panel border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center">
          <p className="text-gray-400 text-xs font-medium tracking-wide">
            Nimbus Weather · Powered by OpenWeatherMap
          </p>
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

function QuickStat({ icon, label, value }) {
  return (
    <div className="glass-panel p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/5 transition-all">
      <p className="text-xl sm:text-2xl mb-1">{icon}</p>
      <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-sm sm:text-base font-bold text-white">{value}</p>
    </div>
  )
}

export default App
