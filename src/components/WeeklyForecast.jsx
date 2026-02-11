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

  const forecasts = Object.entries(dailyForecasts).slice(0, 5).map(([date, data]) => ({
    date,
    high: Math.round(Math.max(...data.temps)),
    low: Math.round(Math.min(...data.temps)),
    icon: data.icons[Math.floor(data.icons.length / 2)],
    weather: data.weather,
  }))

  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #a78bfa, #f472b6)' }} />
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">5-Day Forecast</h3>
      </div>

      <div className="space-y-1">
        {forecasts.map((day, idx) => {
          const range = day.high - day.low || 1
          const isToday = idx === 0

          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/4"
              style={isToday ? { background: 'rgba(255,255,255,0.03)' } : {}}
            >
              <span className={`text-xs font-bold w-24 shrink-0 ${isToday ? 'text-blue-300' : 'text-gray-400'}`}>
                {isToday ? 'Today' : day.date}
              </span>
              <span className="text-2xl shrink-0 weather-icon">{getWeatherIcon(day.icon)}</span>
              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs text-gray-500 font-semibold tabular-nums w-8 text-right">{day.low}°</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (range / 20) * 100)}%`,
                      background: 'linear-gradient(90deg, #4f8bff, #f472b6)',
                      marginLeft: `${Math.min(80, (day.low / 50) * 100)}%`
                    }}
                  />
                </div>
                <span className="text-xs text-white font-bold tabular-nums w-8">{day.high}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
