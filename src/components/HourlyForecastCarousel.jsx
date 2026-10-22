import { getWeatherIcon } from '../api/weatherApi'

export default function HourlyForecastCarousel({ data, unit }) {
  if (!data || data.length === 0) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 overflow-hidden">
      {/* Top Edge Highlight */}
      <div className="top-edge-flare" />

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-1.5 h-4 sm:h-5 rounded-full"
            style={{ background: 'var(--theme-accent)' }}
          />
          <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
            Hourly Telemetry
          </h2>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/40">
          24H Forecast
        </span>
      </div>

      {/* Carousel Track with smooth touch snap */}
      <div className="overflow-x-auto pb-2.5 pt-1 scrollbar-thin snap-x snap-mandatory scroll-smooth -mx-1 px-1">
        <div className="flex gap-2 sm:gap-3.5" style={{ minWidth: 'max-content' }}>
          {data.slice(0, 16).map((item, idx) => {
            const time = new Date(item.dt * 1000)
            const hour = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            const isNow = idx === 0

            return (
              <div
                key={idx}
                className="snap-start shrink-0 rounded-2xl p-3 sm:p-4 text-center transition-all duration-300 group hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                style={{
                  minWidth: '96px',
                  maxWidth: '120px',
                  background: isNow
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isNow
                    ? '1px solid var(--theme-accent)'
                    : '1px solid rgba(255, 255, 255, 0.07)',
                  boxShadow: isNow ? '0 0 20px var(--theme-glow)' : 'none',
                }}
              >
                {/* Subtle top indicator for current hour */}
                {isNow && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: 'var(--theme-accent)' }}
                  />
                )}

                <p
                  className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider mb-1 sm:mb-2 ${
                    isNow ? 'text-white' : 'text-white/45'
                  }`}
                  style={isNow ? { color: 'var(--theme-accent)' } : {}}
                >
                  {isNow ? '● Now' : hour}
                </p>

                <div className="text-2xl sm:text-4xl my-1.5 sm:my-2.5 weather-icon group-hover:scale-115 transition-transform">
                  {getWeatherIcon(item.weather[0].icon)}
                </div>

                <p className="text-base sm:text-lg font-bold font-mono text-white tracking-tight mb-1">
                  {Math.round(item.main.temp)}{tempSymbol}
                </p>

                <div className="flex items-center justify-center gap-1 mt-1 pt-1.5 border-t border-white/5">
                  <span className="text-[9px] sm:text-[10px] text-white/50 font-mono">
                    💧 {item.main.humidity}%
                  </span>
                </div>

                <p className="text-[9px] sm:text-[10px] text-white/40 capitalize truncate mt-0.5">
                  {item.weather[0].description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
