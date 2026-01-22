import { X, Cloud, Wind, Droplets, Eye, Gauge, Thermometer } from 'lucide-react'
import { getWeatherIcon } from '../api/weatherApi'
import { useState } from 'react'

export default function ComparisonView({ isOpen, onClose, currentCity, currentWeather, unit, onLoadCity }) {
  const [comparisonCity, setComparisonCity] = useState('')
  const [comparisonWeather, setComparisonWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  const handleLoadComparison = async () => {
    if (!comparisonCity.trim()) return
    
    setLoading(true)
    try {
      const data = await onLoadCity(comparisonCity)
      setComparisonWeather(data)
    } catch (_err) {
      alert('Could not load weather for ' + comparisonCity)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-2xl font-bold text-white">Weather Comparison</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Load comparison city */}
          <div className="flex gap-2">
            <input
              type="text"
              value={comparisonCity}
              onChange={(e) => setComparisonCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLoadComparison()}
              placeholder="Enter city to compare..."
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleLoadComparison}
              disabled={loading || !comparisonCity.trim()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition"
            >
              {loading ? 'Loading...' : 'Compare'}
            </button>
          </div>

          {/* Comparison Grid */}
          {comparisonWeather && currentWeather && (
            <div className="space-y-4">
              {/* Header Comparison */}
              <div className="grid grid-cols-2 gap-4">
                {/* City 1 */}
                <div className="glass-effect p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-white mb-2">{currentCity}</h3>
                  <p className="text-gray-400 mb-4 capitalize">{currentWeather.weather[0].description}</p>
                  <div className="text-6xl mb-4">{getWeatherIcon(currentWeather.weather[0].icon)}</div>
                  <div className="text-5xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {Math.round(currentWeather.main.temp)}{tempSymbol}
                  </div>
                </div>

                {/* City 2 */}
                <div className="glass-effect p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-white mb-2">{comparisonCity}</h3>
                  <p className="text-gray-400 mb-4 capitalize">{comparisonWeather.weather[0].description}</p>
                  <div className="text-6xl mb-4">{getWeatherIcon(comparisonWeather.weather[0].icon)}</div>
                  <div className="text-5xl font-bold bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {Math.round(comparisonWeather.main.temp)}{tempSymbol}
                  </div>
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <ComparisonMetric
                  label="Feels Like"
                  value1={`${Math.round(currentWeather.main.feels_like)}${tempSymbol}`}
                  value2={`${Math.round(comparisonWeather.main.feels_like)}${tempSymbol}`}
                  icon={<Thermometer className="w-5 h-5" />}
                />
                <ComparisonMetric
                  label="Humidity"
                  value1={`${currentWeather.main.humidity}%`}
                  value2={`${comparisonWeather.main.humidity}%`}
                  icon={<Droplets className="w-5 h-5" />}
                />
                <ComparisonMetric
                  label="Wind Speed"
                  value1={`${currentWeather.wind.speed.toFixed(1)} ${speedUnit}`}
                  value2={`${comparisonWeather.wind.speed.toFixed(1)} ${speedUnit}`}
                  icon={<Wind className="w-5 h-5" />}
                />
                <ComparisonMetric
                  label="Visibility"
                  value1={`${(currentWeather.visibility / 1000).toFixed(1)} km`}
                  value2={`${(comparisonWeather.visibility / 1000).toFixed(1)} km`}
                  icon={<Eye className="w-5 h-5" />}
                />
                <ComparisonMetric
                  label="Pressure"
                  value1={`${currentWeather.main.pressure} mb`}
                  value2={`${comparisonWeather.main.pressure} mb`}
                  icon={<Gauge className="w-5 h-5" />}
                />
                <ComparisonMetric
                  label="Cloud Cover"
                  value1={`${currentWeather.clouds.all}%`}
                  value2={`${comparisonWeather.clouds.all}%`}
                  icon={<Cloud className="w-5 h-5" />}
                />
              </div>

              {/* Better/Worse */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Comparison Summary</h4>
                <ul className="space-y-1 text-sm text-blue-200">
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

function ComparisonMetric({ label, value1, value2, icon }) {
  return (
    <div className="glass-effect p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400">{icon}</span>
        <span className="font-semibold text-white">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-500/20 rounded-lg p-2">
          <p className="text-xs text-blue-300">City 1</p>
          <p className="font-bold text-white">{value1}</p>
        </div>
        <div className="bg-orange-500/20 rounded-lg p-2">
          <p className="text-xs text-orange-300">City 2</p>
          <p className="font-bold text-white">{value2}</p>
        </div>
      </div>
    </div>
  )
}
