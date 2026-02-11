import { getWeatherIcon } from '../api/weatherApi'

export default function HourlyForecastCarousel({ data, unit }) {
  if (!data || data.length === 0) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #4f8bff, #22d3ee)' }} />
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Hourly Forecast</h3>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {data.slice(0, 12).map((item, idx) => {
            const time = new Date(item.dt * 1000)
            const hour = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            const isNow = idx === 0

            return (
              <div
                key={idx}
                className={`shrink-0 rounded-2xl p-4 text-center transition-all duration-300 group ${isNow ? 'animate-pulse-glow' : ''
                  }`}
                style={{
                  minWidth: '110px',
                  background: isNow
                    ? 'linear-gradient(135deg, rgba(79,139,255,0.15) 0%, rgba(34,211,238,0.08) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  border: isNow
                    ? '1px solid rgba(79,139,255,0.25)'
                    : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${isNow ? 'text-blue-300' : 'text-gray-500'
                  }`}>
                  {isNow ? 'Now' : hour}
                </p>
                <div className="text-3xl mb-3 weather-icon">{getWeatherIcon(item.weather[0].icon)}</div>
                <p className="text-lg font-bold text-white tracking-tight">
                  {Math.round(item.main.temp)}°
                </p>
                <p className="text-[10px] text-gray-500 mt-1 capitalize line-clamp-1">
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
