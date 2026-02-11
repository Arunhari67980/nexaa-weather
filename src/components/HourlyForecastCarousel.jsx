import { getWeatherIcon } from '../api/weatherApi'

export default function HourlyForecastCarousel({ data, unit }) {
  if (!data || data.length === 0) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 rounded-full"
          style={{ background: 'linear-gradient(180deg, #3b82f6, #06b6d4)' }} />
        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
          Hourly Forecast
        </h3>
      </div>

      {/* Carousel */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {data.slice(0, 24).map((item, idx) => {
            const time = new Date(item.dt * 1000)
            const hour = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            const isNow = idx === 0

            return (
              <div
                key={idx}
                className={`shrink-0 rounded-2xl p-5 text-center transition-all duration-300 group hover:transform hover:scale-105 cursor-pointer`}
                style={{
                  minWidth: '125px',
                  background: isNow
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: isNow
                    ? '1px solid rgba(59, 130, 246, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isNow
                    ? '0 8px 24px rgba(59, 130, 246, 0.15)'
                    : 'none'
                }}
              >
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isNow ? 'text-blue-300' : 'text-gray-400'}`}>
                  {isNow ? '●  Now' : hour}
                </p>
                
                <div className="text-4xl mb-4 weather-icon group-hover:scale-110 transition-transform">
                  {getWeatherIcon(item.weather[0].icon)}
                </div>
                
                <p className="text-xl font-bold text-white tracking-tight mb-2">
                  {Math.round(item.main.temp)}{tempSymbol}
                </p>
                
                <div className="flex items-center justify-center gap-1 mb-3">
                  <span className="text-[10px] text-gray-500">💧 {item.main.humidity}%</span>
                </div>

                <p className="text-[10px] text-gray-500 capitalize line-clamp-2">
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
