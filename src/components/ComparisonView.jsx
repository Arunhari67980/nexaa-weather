import { X, Wind, Droplets, Eye, Gauge, Thermometer, Cloud } from 'lucide-react'
import { getWeatherIcon } from '../api/weatherApi'
import { useState } from 'react'
import { fetchWeatherData } from '../api/weatherApi'

export default function ComparisonView({ isOpen, onClose, currentCity, currentWeather, unit, onLoadCity }) {
  const [comparisonCity, setComparisonCity] = useState('')
  const [comparisonWeather, setComparisonWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  const handleLoad = async () => {
    if (!comparisonCity.trim()) return
    setLoading(true)
    try {
      const data = await onLoadCity(comparisonCity)
      setComparisonWeather(data)
    } catch { alert('Could not load weather for ' + comparisonCity) }
    finally { setLoading(false) }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <div className="glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        style={{ background: 'rgba(12,16,32,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-bold text-white">⚡ City Comparison</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              value={comparisonCity}
              onChange={(e) => setComparisonCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
              placeholder="Enter city to compare..."
              className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 font-medium"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <button onClick={handleLoad} disabled={loading || !comparisonCity.trim()}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #4f8bff, #6366f1)' }}>
              {loading ? '...' : 'Compare'}
            </button>
          </div>

          {/* Comparison */}
          {comparisonWeather && currentWeather && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CityCard name={currentCity} weather={currentWeather} tempSymbol={tempSymbol} accent="#4f8bff" />
                <CityCard name={comparisonCity} weather={comparisonWeather} tempSymbol={tempSymbol} accent="#f472b6" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Metric label="Feels Like" v1={`${Math.round(currentWeather.main.feels_like)}°`} v2={`${Math.round(comparisonWeather.main.feels_like)}°`} />
                <Metric label="Humidity" v1={`${currentWeather.main.humidity}%`} v2={`${comparisonWeather.main.humidity}%`} />
                <Metric label="Wind" v1={`${currentWeather.wind.speed.toFixed(1)} ${speedUnit}`} v2={`${comparisonWeather.wind.speed.toFixed(1)} ${speedUnit}`} />
                <Metric label="Pressure" v1={`${currentWeather.main.pressure} hPa`} v2={`${comparisonWeather.main.pressure} hPa`} />
                <Metric label="Visibility" v1={`${(currentWeather.visibility / 1000).toFixed(1)} km`} v2={`${(comparisonWeather.visibility / 1000).toFixed(1)} km`} />
                <Metric label="Clouds" v1={`${currentWeather.clouds.all}%`} v2={`${comparisonWeather.clouds.all}%`} />
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(79,139,255,0.06)', border: '1px solid rgba(79,139,255,0.1)' }}>
                <p className="text-xs font-bold text-blue-300 mb-2">Summary</p>
                <ul className="space-y-1 text-sm text-blue-100">
                  <li>🌡️ {currentWeather.main.temp > comparisonWeather.main.temp ? currentCity : comparisonCity} is warmer</li>
                  <li>💨 {currentWeather.wind.speed > comparisonWeather.wind.speed ? currentCity : comparisonCity} has more wind</li>
                  <li>💧 {currentWeather.main.humidity > comparisonWeather.main.humidity ? currentCity : comparisonCity} is more humid</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CityCard({ name, weather, tempSymbol, accent }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
      <p className="text-xs text-gray-400 capitalize mb-3">{weather.weather[0].description}</p>
      <div className="text-4xl mb-3 weather-icon">{getWeatherIcon(weather.weather[0].icon)}</div>
      <p className="text-4xl font-bold tracking-tighter" style={{ color: accent }}>
        {Math.round(weather.main.temp)}{tempSymbol}
      </p>
    </div>
  )
}

function Metric({ label, v1, v2 }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex justify-between gap-2">
        <span className="text-sm font-bold" style={{ color: '#4f8bff' }}>{v1}</span>
        <span className="text-sm font-bold" style={{ color: '#f472b6' }}>{v2}</span>
      </div>
    </div>
  )
}
