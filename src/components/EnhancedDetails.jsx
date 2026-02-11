import { Wind, Sun, Moon, Shirt, Share2, Download } from 'lucide-react'
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

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Sun Times Card */}
      <div className="glass-card rounded-3xl p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full"
            style={{ background: 'linear-gradient(180deg, #f59e0b, #fb923c)' }} />
          <h3 className="text-base font-bold text-white uppercase tracking-tight">Sun & Moon</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Sunrise */}
          <div className="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 overflow-hidden group cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1), transparent)',
                transform: 'translate(50%, -50%)'
              }} />
            <Sun className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 mb-2 sm:mb-3" />
            <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">Sunrise</p>
            <p className="text-base sm:text-lg font-bold text-white mt-1">
              {sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Sunset */}
          <div className="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 overflow-hidden group cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent)',
                transform: 'translate(50%, -50%)'
              }} />
            <Moon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 mb-2 sm:mb-3" />
            <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">Sunset</p>
            <p className="text-base sm:text-lg font-bold text-white mt-1">
              {sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Wind Card */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden group">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-1 h-6 rounded-full"
            style={{ background: 'linear-gradient(180deg, #60a5fa, #818cf8)' }} />
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Wind</h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">{data.wind.speed.toFixed(1)}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-semibold mt-1 sm:mt-2">{speedUnit} • {windDir}</p>
          </div>
          <div className="text-5xl sm:text-6xl md:text-7xl group-hover:scale-110 transition-transform" style={{ animation: 'drift 4s ease-in-out infinite' }}>
            {windEmoji}
          </div>
        </div>

        {/* Wind gauge */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
          <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (data.wind.speed / 30) * 100)}%`,
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa)'
              }}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 text-right">Wind Speed</p>
        </div>
      </div>

      {/* Activities Suggestions */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-1 h-6 rounded-full"
            style={{ background: 'linear-gradient(180deg, #34d399, #22d3ee)' }} />
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Activity Suggestions</h3>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {activities.slice(0, 4).map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.05) 0%, rgba(34, 211, 238, 0.03) 100%)',
                border: '1px solid rgba(34, 211, 153, 0.2)'
              }}
            >
              <div className="text-2xl flex-shrink-0">
                {activity.includes('Running') && '🏃'}
                {activity.includes('Cycling') && '🚴'}
                {activity.includes('Swimming') && '🏊'}
                {activity.includes('Reading') && '📖'}
                {activity.includes('Picnic') && '🧺'}
                {activity.includes('Indoor') && '🏠'}
              </div>
              <span className="text-sm font-semibold text-gray-200">{activity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What to Wear */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-1 h-6 rounded-full"
            style={{ background: 'linear-gradient(180deg, #f472b6, #fb923c)' }} />
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">What to Wear</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
          {/* Top Clothing */}
          <div className="rounded-lg sm:rounded-2xl p-3 sm:p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">Top</p>
            <p className="text-xs sm:text-sm font-bold text-white">{outfit.top}</p>
          </div>

          {/* Bottom Clothing */}
          <div className="rounded-lg sm:rounded-2xl p-3 sm:p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">Bottom</p>
            <p className="text-xs sm:text-sm font-bold text-white">{outfit.bottom}</p>
          </div>
        </div>

        {/* Accessories */}
        {outfit.accessories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            {outfit.accessories.map((accessory, idx) => (
              <span
                key={idx}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold badge-primary"
              >
                {accessory}
              </span>
            ))}
          </div>
        )}

        {/* Advice */}
        <div className="rounded-lg sm:rounded-2xl p-3 sm:p-4 flex gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
          <Shirt className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">{outfit.advice}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 sm:gap-3 animate-slide-up">
        <button
          onClick={() => shareWeather(city, Math.round(data.main.temp), data.weather[0].description)}
          className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 rounded-lg sm:rounded-2xl glass-card transition-all hover:bg-white/5 group border border-white/10"
        >
          <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-300 hidden sm:inline">Share</span>
        </button>
        <button
          onClick={() => exportWeatherAsCSV(data, city)}
          className="flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 rounded-lg sm:rounded-2xl glass-card transition-all hover:bg-white/5 group border border-white/10"
        >
          <Download className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-300 hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  )
}
