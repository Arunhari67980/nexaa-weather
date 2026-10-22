import { Wind, Sun, Moon, Shirt, Share2, Download, Sparkles } from 'lucide-react'
import {
  getActivitySuggestions,
  getOutfitRecommendation,
  getWindDirection,
  getWindDirectionEmoji,
  exportWeatherAsCSV,
  shareWeather,
} from '../utils/weatherUtils'

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
      {/* Sun & Celestial Ephemeris */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden">
        <div className="top-edge-flare" />
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-1.5 h-4 sm:h-5 rounded-full"
              style={{ background: 'var(--theme-accent)' }}
            />
            <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
              Solar & Lunar Orbit
            </h2>
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Ephemeris
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          {/* Sunrise */}
          <div
            className="rounded-xl sm:rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:border-amber-400/40 transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-1.5 sm:mb-2 transition-transform group-hover:scale-110" />
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50">
              Sunrise
            </p>
            <p className="text-sm sm:text-xl font-bold font-mono text-white mt-0.5 sm:mt-1">
              {sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Sunset */}
          <div
            className="rounded-xl sm:rounded-2xl p-3 sm:p-5 relative overflow-hidden group hover:border-indigo-400/40 transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, transparent 100%)',
              border: '1px solid rgba(129, 140, 248, 0.2)',
            }}
          >
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 mb-1.5 sm:mb-2 transition-transform group-hover:scale-110" />
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50">
              Sunset
            </p>
            <p className="text-sm sm:text-xl font-bold font-mono text-white mt-0.5 sm:mt-1">
              {sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Wind Vectors & Dynamics */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden">
        <div className="top-edge-flare" />
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-1.5 h-4 sm:h-5 rounded-full"
              style={{ background: 'var(--theme-accent)' }}
            />
            <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
              Anemometer Vectors
            </h2>
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-widest">
            {windDir} · {data.wind.deg || 0}°
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-4xl font-bold font-mono text-white">
                {data.wind.speed.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-white/50 uppercase">{speedUnit}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/50 mt-0.5">Direction: {windDir}</p>
          </div>
          <div className="text-3xl sm:text-5xl weather-icon">{windEmoji}</div>
        </div>

        {/* Dynamic Wind Gauge */}
        <div className="pt-2 sm:pt-3 border-t border-white/5">
          <div className="h-1.5 sm:h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (data.wind.speed / 25) * 100)}%`,
                background: 'linear-gradient(90deg, var(--theme-accent), var(--theme-accent-secondary))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Lifestyle Suggestions: Activities & Wardrobe */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden">
        <div className="top-edge-flare" />
        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-1.5 h-4 sm:h-5 rounded-full"
              style={{ background: 'var(--theme-accent)' }}
            />
            <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
              Tactical Recommendations
            </h2>
          </div>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        {/* Activity Pills */}
        <div className="mb-4">
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">
            Optimal Activities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {activities.slice(0, 4).map((activity, idx) => (
              <div
                key={idx}
                className="p-2 sm:p-2.5 rounded-xl text-xs font-medium bg-white/5 border border-white/5 hover:border-white/20 transition-all flex items-center gap-2"
              >
                <span className="text-white/90">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wardrobe Advice */}
        <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5 sm:gap-3">
          <Shirt className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" style={{ color: 'var(--theme-accent)' }} />
          <div>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/40 mb-0.5">
              Curated Wardrobe
            </p>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              {outfit.top} · {outfit.bottom}
            </p>
            <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5">{outfit.advice}</p>
          </div>
        </div>
      </div>

      {/* Share and Export Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() =>
            shareWeather(city, Math.round(data.main.temp), data.weather[0].description)
          }
          className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl glass-card flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-white transition-all group"
        >
          <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Dispatch Briefing</span>
        </button>

        <button
          onClick={() => exportWeatherAsCSV(data, city)}
          className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl glass-card flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-white transition-all group"
        >
          <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}
