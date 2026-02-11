import { getWeatherIcon } from '../api/weatherApi'

export default function WeeklyForecast({ data, unit }) {
  if (!data || !data.list) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  // Group forecasts by day
  const dailyForecasts = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    if (!acc[date]) {
      acc[date] = { temps: [], icons: [], weather: item.weather }
    }
    acc[date].temps.push(item.main.temp)
    acc[date].icons.push(item.weather[0].icon)
    return acc
  }, {})

  const forecasts = Object.entries(dailyForecasts).slice(0, 7).map(([date, data]) => ({
    date,
    high: Math.round(Math.max(...data.temps)),
    low: Math.round(Math.min(...data.temps)),
    icon: data.icons[Math.floor(data.icons.length / 2)],
    weather: data.weather,
  }))

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full"
          style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight uppercase">
          7-Day Forecast
        </h3>
      </div>

      {/* Forecast List */}
      <div className="space-y-2">
        {forecasts.map((day, idx) => {
          const range = day.high - day.low || 1
          const isToday = idx === 0

          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-3.5 rounded-2xl transition-all hover:bg-white/5 group cursor-pointer"
              style={isToday ? { background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' } : { background: 'rgba(255,255,255,0.02)' }}
            >
              <span className={`text-sm font-bold w-20 shrink-0 tracking-tight ${isToday ? 'text-blue-300' : 'text-gray-400'}`}>
                {isToday ? 'Today' : day.date.split(',')[0]}
              </span>
              
              <span className="text-3xl shrink-0 weather-icon group-hover:scale-110 transition-transform">
                {getWeatherIcon(day.icon)}
              </span>

              <div className="flex-1 flex items-center gap-4 lg:gap-3">
                {/* Temperature Bar */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold w-6 text-right">{day.low}°</span>
                  
                  <div className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (range / 20) * 100)}%`,
                        background: isToday 
                          ? 'linear-gradient(90deg, #3b82f6, #06b6d4)' 
                          : 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                        marginLeft: `${Math.min(80, (day.low / 50) * 100)}%`
                      }}
                    />
                  </div>

                  <span className="text-xs text-white font-bold w-6">{day.high}°</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
