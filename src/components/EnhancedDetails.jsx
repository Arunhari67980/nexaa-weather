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
    <div className="space-y-4">

      {/* Sun Times */}
      <div className="glass-panel rounded-3xl p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #fbbf24, #f97316)' }} />
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Sun &amp; Moon</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.1)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-gray-500 font-bold uppercase">Sunrise</span>
            </div>
            <p className="text-lg font-bold text-white tracking-tight">{sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-gray-500 font-bold uppercase">Sunset</span>
            </div>
            <p className="text-lg font-bold text-white tracking-tight">{sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Wind */}
      <div className="glass-panel rounded-3xl p-6 animate-scale-in delay-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #60a5fa, #818cf8)' }} />
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Wind</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white tracking-tighter">{windDir}</p>
            <p className="text-sm text-gray-400 font-medium mt-1">{data.wind.speed.toFixed(1)} {speedUnit}</p>
          </div>
          <div className="text-5xl animate-bounce-gentle">{windEmoji}</div>
        </div>
      </div>

      {/* Activities */}
      <div className="glass-panel rounded-3xl p-6 animate-scale-in delay-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #34d399, #22d3ee)' }} />
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Suggestions</h3>
        </div>
        <div className="space-y-2">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-lg">{a.split(' ')[0]}</span>
              <span className="text-sm text-gray-300 font-medium">{a.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div className="glass-panel rounded-3xl p-6 animate-scale-in delay-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #f472b6, #fb923c)' }} />
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">What to Wear</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Top</p>
            <p className="text-sm font-bold text-white">{outfit.top}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Bottom</p>
            <p className="text-sm font-bold text-white">{outfit.bottom}</p>
          </div>
        </div>
        {outfit.accessories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {outfit.accessories.map((acc, i) => (
              <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(79,139,255,0.1)', color: '#93c5fd', border: '1px solid rgba(79,139,255,0.15)' }}>
                {acc}
              </span>
            ))}
          </div>
        )}
        <div className="rounded-xl p-3" style={{ background: 'rgba(79,139,255,0.06)', border: '1px solid rgba(79,139,255,0.1)' }}>
          <div className="flex gap-2 items-start">
            <Shirt className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-100 font-medium leading-relaxed">{outfit.advice}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 animate-slide-up delay-400">
        <button
          onClick={() => shareWeather(city, Math.round(data.main.temp), data.weather[0].description)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-panel transition-all hover:bg-white/5 group"
        >
          <Share2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Share</span>
        </button>
        <button
          onClick={() => exportWeatherAsCSV(data, city)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-panel transition-all hover:bg-white/5 group"
        >
          <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Export</span>
        </button>
      </div>
    </div>
  )
}
