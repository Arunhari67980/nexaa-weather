import { getWeatherIcon } from '../api/weatherApi'

export default function WeeklyForecast({ data, unit }) {
  if (!data || !data.list) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  // Group forecasts by day
  const dailyForecasts = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    if (!acc[date]) {
      acc[date] = { temps: [], icons: [], weather: item.weather }
    }
    acc[date].temps.push(item.main.temp)
    acc[date].icons.push(item.weather[0].icon)
    return acc
  }, {})

  const forecasts = Object.entries(dailyForecasts)
    .slice(0, 7)
    .map(([date, data]) => ({
      date,
      high: Math.round(Math.max(...data.temps)),
      low: Math.round(Math.min(...data.temps)),
      icon: data.icons[Math.floor(data.icons.length / 2)],
      weather: data.weather,
    }))

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 overflow-hidden">
      {/* Top Edge Highlight */}
      <div className="top-edge-flare" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-1.5 h-4 sm:h-5 rounded-full"
            style={{ background: 'var(--theme-accent)' }}
          />
          <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
            7-Day Synoptic Outlook
          </h2>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/40">
          Weekly Scope
        </span>
      </div>

      {/* Forecast List */}
      <div className="space-y-2">
        {forecasts.map((day, idx) => {
          const range = day.high - day.low || 1
          const isToday = idx === 0
          const shortDay = day.date.split(',')[0].slice(0, 3).toUpperCase()

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-white/5 group cursor-pointer"
              style={
                isToday
                  ? {
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
                      border: '1px solid var(--theme-glass-border)',
                      boxShadow: '0 0 15px var(--theme-glow)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }
              }
            >
              {/* Day Name */}
              <div className="w-12 sm:w-20 shrink-0">
                <span
                  className={`text-[11px] sm:text-xs font-bold font-mono ${
                    isToday ? 'text-white' : 'text-white/60'
                  }`}
                  style={isToday ? { color: 'var(--theme-accent)' } : {}}
                >
                  {isToday ? 'TODAY' : shortDay}
                </span>
                <p className="text-[9px] text-white/35 font-mono hidden sm:block">
                  {day.date.split(',')[1]}
                </p>
              </div>

              {/* Weather Icon */}
              <div className="text-xl sm:text-3xl shrink-0 weather-icon group-hover:scale-120 transition-transform">
                {getWeatherIcon(day.icon)}
              </div>

              {/* Temperature Bar */}
              <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <span className="text-[11px] sm:text-xs text-white/40 font-mono font-medium w-6 sm:w-7 text-right shrink-0">
                  {day.low}°
                </span>

                <div
                  className="flex-1 h-1.5 sm:h-2 rounded-full overflow-hidden min-w-[50px]"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (range / 20) * 100 + 20)}%`,
                      background: isToday
                        ? 'linear-gradient(90deg, var(--theme-accent), var(--theme-accent-secondary))'
                        : 'linear-gradient(90deg, rgba(255,255,255,0.3), var(--theme-accent))',
                    }}
                  />
                </div>

                <span className="text-[11px] sm:text-xs text-white font-mono font-bold w-6 sm:w-7 shrink-0">
                  {day.high}°
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
