import { getWeatherIcon } from '../api/weatherApi'
import { Cloud, Droplets, Wind } from 'lucide-react'

export default function WeeklyForecast({ data, unit }) {
  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  // Process data to get daily forecasts
  const dailyForecasts = {}
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temps: [],
        main: item.weather[0].main,
        icon: item.weather[0].icon,
        humidity: [],
        rain: item.rain?.['3h'] || 0,
        wind: [],
      }
    }
    dailyForecasts[date].temps.push(item.main.temp)
    dailyForecasts[date].humidity.push(item.main.humidity)
    dailyForecasts[date].wind.push(item.wind.speed)
  })

  const forecasts = Object.entries(dailyForecasts).slice(0, 5).map(([date, data]) => ({
    date,
    high: Math.max(...data.temps),
    low: Math.min(...data.temps),
    condition: data.main,
    icon: data.icon,
    humidity: Math.round(data.humidity.reduce((a, b) => a + b) / data.humidity.length),
    wind: (data.wind.reduce((a, b) => a + b) / data.wind.length).toFixed(1),
    rain: data.rain,
  }))

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
      <h3 className="text-xl font-bold text-white mb-4">5-Day Forecast</h3>
      
      <div className="space-y-3">
        {forecasts.map((forecast, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-blue-400/30 transition"
          >
            {/* Date */}
            <div className="min-w-[120px]">
              <p className="text-white font-medium">{forecast.date}</p>
            </div>

            {/* Condition & Icon */}
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getWeatherIcon(forecast.icon)}</span>
              <div>
                <p className="text-white font-medium">{forecast.condition}</p>
                <p className="text-gray-400 text-sm">{forecast.rain ? `${forecast.rain.toFixed(1)}mm` : 'No rain'}</p>
              </div>
            </div>

            {/* Temperature */}
            <div className="text-center min-w-[80px]">
              <p className="text-white font-bold">{Math.round(forecast.high)}{tempSymbol}</p>
              <p className="text-gray-400 text-sm">{Math.round(forecast.low)}{tempSymbol}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>{forecast.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4 text-amber-400" />
                <span>{forecast.wind} m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
