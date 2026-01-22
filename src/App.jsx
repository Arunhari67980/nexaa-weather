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

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('temperatureUnit', unit)
  }, [unit])

  useEffect(() => {
    localStorage.setItem('showAlerts', JSON.stringify(showAlerts))
  }, [showAlerts])

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches))
  }, [recentSearches])

  useEffect(() => {
    localStorage.setItem('favoriteSearches', JSON.stringify(favorites))
  }, [favorites])

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

      // Fetch air quality
      const airQuality = await fetchAirQuality(weather.coord.lat, weather.coord.lon)
      setAqi(airQuality)

      // Add to recent searches
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
    if (searchCity.trim()) {
      loadWeatherData(searchCity)
    }
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
    <div className="min-h-screen w-full flex flex-col bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="glass-effect-dark sticky top-0 z-50 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-slide-down">
            <div className="p-2 bg-linear-to-br from-blue-400 to-cyan-400 rounded-xl">
              <Cloud className="w-6 h-6 text-slate-900 animate-bounce-gentle" />
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Weather
            </h1>
          </div>

          <SearchBar onSearch={handleSearch} />

          <div className="flex items-center gap-3 animate-slide-down">
            {currentWeather && (
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-lg transition-all duration-300 hover:bg-white/10 button-glow ${
                  refreshing ? 'animate-spin-slow' : ''
                }`}
                title="Refresh weather data"
              >
                <RefreshCw className="w-5 h-5 text-gray-300" />
              </button>
            )}

            {currentWeather && (
              <button
                onClick={() => setShowComparison(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition button-glow"
                title="Compare with another city"
              >
                <BarChart3 className="w-5 h-5 text-gray-300" />
              </button>
            )}

            {currentWeather && (
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isFavorited
                    ? 'text-yellow-400 hover:bg-yellow-400/10'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className="w-5 h-5"
                  fill={isFavorited ? 'currentColor' : 'none'}
                />
              </button>
            )}

            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'map' : 'cards')}
              className="p-2 hover:bg-white/10 rounded-lg transition button-glow"
              title="Toggle map view"
            >
              <MapPin className="w-5 h-5 text-gray-300" />
            </button>

            <button
              onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
              className="px-3 py-1.5 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-medium transition button-glow"
            >
              °{unit === 'metric' ? 'C' : 'F'}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition button-glow"
              title="Open settings"
            >
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 overflow-y-auto page-transition">
        {/* Error Message with Animation */}
        {error && (
          <div className="mb-6 p-4 bg-linear-to-r from-red-500/20 to-red-600/20 border border-red-500/50 rounded-2xl text-red-200 animate-slide-down shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !currentWeather ? (
          <div className="space-y-6">
            <LoadingSkeleton />
          </div>
        ) : currentWeather ? (
          <>
            {/* Alerts Banner */}
            {showAlerts && currentWeather && (
              <div className="animate-slide-down mb-6">
                <AlertsBanner weather={currentWeather} />
              </div>
            )}

            {viewMode === 'cards' ? (
              <>
                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Large Current Weather & Charts */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="animate-scale-in">
                      <CurrentWeatherCard
                        data={currentWeather}
                        unit={unit}
                        city={city}
                      />
                    </div>
                    
                    {/* Temperature Trends Chart */}
                    {forecastData && (
                      <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                        <TemperatureTrends data={forecastData} unit={unit} />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Quick Stats & Sidebar */}
                  <div className="space-y-4">
                    <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                      <EnhancedDetails
                        data={currentWeather}
                        unit={unit}
                        city={city}
                        forecastData={forecastData}
                      />
                    </div>

                    {/* Air Quality Index */}
                    {aqi && (
                      <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                        <AirQualityIndex
                          aqi={aqi}
                          lat={currentWeather.coord.lat}
                          lon={currentWeather.coord.lon}
                        />
                      </div>
                    )}

                    <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
                      <DetailedWeather data={currentWeather} unit={unit} />
                    </div>

                    <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                      <RecentSearches
                        onSelect={handleSearch}
                        recentSearches={recentSearches}
                        favorites={favorites}
                      />
                    </div>
                  </div>
                </div>

                {/* Hourly Forecast */}
                {forecastData && (
                  <div className="mt-6 animate-slide-up">
                    <HourlyForecastCarousel
                      data={forecastData.list.slice(0, 8)}
                      unit={unit}
                    />
                  </div>
                )}

                {/* Weekly Forecast */}
                {forecastData && (
                  <div className="mt-6 animate-slide-up">
                    <WeeklyForecast data={forecastData} unit={unit} />
                  </div>
                )}
              </>
            ) : (
              <div className="animate-fade-in">
                <MapView data={currentWeather} city={city} />
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/10 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">Weather data powered by OpenWeatherMap API</p>
          {currentWeather && (
            <p className="text-xs text-gray-500 mt-2 animate-pulse">
              Last updated: {new Date(currentWeather.dt * 1000).toLocaleTimeString()}
            </p>
          )}
        </div>
      </footer>

      {/* Settings Panel */}
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

      {/* Comparison View Modal */}
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
