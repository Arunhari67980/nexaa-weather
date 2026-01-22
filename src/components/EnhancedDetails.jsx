import { Cloud, Activity, Shirt, Share2, Download, MapPin, Wind, Eye, Droplets, Gauge } from 'lucide-react'
import { getActivitySuggestions, getOutfitRecommendation, getWindDirection, getWindDirectionEmoji, exportWeatherAsCSV, shareWeather } from '../utils/weatherUtils'

export default function EnhancedDetails({ data, unit, city }) {
  if (!data) return null

  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'
  
  const activities = getActivitySuggestions(data.weather, data.main.temp)
  const outfit = getOutfitRecommendation(data.main.temp, data.weather, data.main.humidity)
  
  const sunrise = new Date(data.sys.sunrise * 1000)
  const sunset = new Date(data.sys.sunset * 1000)
  const windDir = getWindDirection(data.wind.deg)
  const windEmoji = getWindDirectionEmoji(data.wind.deg)

  const handleShare = () => {
    shareWeather(city, Math.round(data.main.temp), data.weather[0].description)
  }

  const handleExport = () => {
    exportWeatherAsCSV(data, city)
  }

  return (
    <div className="space-y-6">
      {/* Sun Times */}
      <div className="glass-effect p-4 rounded-xl animate-scale-in">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          ☀️ Sun Times
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400">Sunrise</p>
            <p className="text-lg font-semibold text-yellow-300">{sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400">Sunset</p>
            <p className="text-lg font-semibold text-orange-300">{sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Wind Direction Visual */}
      <div className="glass-effect p-4 rounded-xl animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          💨 Wind Direction
        </h3>
        <div className="flex flex-col items-center">
          <div className="text-5xl mb-2">{windEmoji}</div>
          <p className="text-2xl font-bold text-blue-400">{windDir}</p>
          <p className="text-xs text-gray-400 mt-1">{data.wind.speed.toFixed(1)} {speedUnit}</p>
        </div>
      </div>

      {/* Activity Suggestions */}
      <div className="glass-effect p-4 rounded-xl animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" /> Activities
        </h3>
        <div className="space-y-2">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <span className="text-lg">{activity.split(' ')[0]}</span>
              <span className="text-sm text-gray-300">{activity.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outfit Recommendations */}
      <div className="glass-effect p-4 rounded-xl animate-scale-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Shirt className="w-4 h-4 text-pink-400" /> What to Wear
        </h3>
        <div className="space-y-2">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400">Top</p>
            <p className="font-medium text-white">{outfit.top}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400">Bottom</p>
            <p className="font-medium text-white">{outfit.bottom}</p>
          </div>
          {outfit.accessories.length > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Accessories</p>
              <div className="flex flex-wrap gap-1">
                {outfit.accessories.map((acc, idx) => (
                  <span key={idx} className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-sm text-blue-300 font-medium">{outfit.advice}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-effect p-4 rounded-xl animate-scale-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-sm font-semibold text-white mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <StatItem icon="👁️" label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
          <StatItem icon="💧" label="Humidity" value={`${data.main.humidity}%`} />
          <StatItem icon="📊" label="Pressure" value={`${data.main.pressure} mb`} />
          <StatItem icon="☁️" label="Cloudiness" value={`${data.clouds.all}%`} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 animate-slide-up">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  )
}

function StatItem({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-lg p-2">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-white">{icon} {value}</p>
    </div>
  )
}
