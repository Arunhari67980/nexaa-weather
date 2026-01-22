import { Sun, Moon, Wind, Compass } from 'lucide-react'

export default function DetailedWeather({ data, unit }) {
  if (!data) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round((degrees || 0) / 22.5) % 16
    return directions[index]
  }

  return (
    <div className="space-y-4">
      <DetailCard
        title="Sun Times"
        items={[
          { icon: <Sun className="w-5 h-5 text-yellow-400" />, label: 'Sunrise', value: sunrise },
          { icon: <Moon className="w-5 h-5 text-blue-400" />, label: 'Sunset', value: sunset },
        ]}
      />

      <DetailCard
        title="Wind"
        items={[
          { icon: <Wind className="w-5 h-5 text-cyan-400" />, label: 'Speed', value: `${data.wind.speed.toFixed(1)} ${unit === 'metric' ? 'm/s' : 'mph'}` },
          { icon: <Compass className="w-5 h-5 text-amber-400" />, label: 'Direction', value: `${getWindDirection(data.wind.deg)} (${data.wind.deg}°)` },
        ]}
      />

      <DetailCard
        title="Temperature"
        items={[
          { label: 'Current', value: `${Math.round(data.main.temp)}${tempSymbol}` },
          { label: 'Feels Like', value: `${Math.round(data.main.feels_like)}${tempSymbol}` },
          { label: 'Dew Point', value: `${Math.round(data.main.temp - (100 - data.main.humidity) / 5)}${tempSymbol}` },
        ]}
      />
    </div>
  )
}

function DetailCard({ title, items }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-blue-400/30 transition">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-gray-400 text-sm">{item.label}</span>
            </div>
            <span className="text-white font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
