import { getWeatherIcon } from '../api/weatherApi'
import { Cloud, Droplets } from 'lucide-react'

export default function HourlyForecastCarousel({ data, unit }) {
  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
      <h3 className="text-xl font-bold text-white mb-4">Hourly Forecast</h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {data.slice(0, 12).map((item, idx) => {
            const date = new Date(item.dt * 1000)
            const time = date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })

            return (
              <div
                key={idx}
                className="flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px] hover:bg-white/10 hover:border-blue-400/30 transition"
              >
                <p className="text-gray-400 text-sm font-medium mb-2">{time}</p>
                <p className="text-3xl mb-2">{getWeatherIcon(item.weather[0].icon)}</p>
                <p className="text-white font-bold mb-2">{Math.round(item.main.temp)}{tempSymbol}</p>
                <p className="text-gray-400 text-xs mb-3 capitalize">{item.weather[0].main}</p>
                
                <div className="border-t border-white/10 pt-2 space-y-1">
                  <div className="flex items-center justify-center gap-1 text-gray-400">
                    <Droplets className="w-3 h-3" />
                    <span className="text-xs">{item.main.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-400">
                    <Cloud className="w-3 h-3" />
                    <span className="text-xs">{item.clouds.all}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
