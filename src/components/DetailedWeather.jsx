import { Droplets, Wind, Gauge, Eye, Thermometer, Cloud } from 'lucide-react'

export default function DetailedWeather({ data, unit }) {
  if (!data) return null

  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  const metrics = [
    { icon: <Thermometer className="w-4 h-4 text-rose-400" />, label: 'Feels Like', value: `${Math.round(data.main.feels_like)}°` },
    { icon: <Droplets className="w-4 h-4 text-cyan-400" />, label: 'Humidity', value: `${data.main.humidity}%` },
    { icon: <Wind className="w-4 h-4 text-blue-400" />, label: 'Wind', value: `${data.wind.speed.toFixed(1)} ${speedUnit}` },
    { icon: <Gauge className="w-4 h-4 text-violet-400" />, label: 'Pressure', value: `${data.main.pressure} hPa` },
    { icon: <Eye className="w-4 h-4 text-indigo-400" />, label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km` },
    { icon: <Cloud className="w-4 h-4 text-gray-400" />, label: 'Clouds', value: `${data.clouds.all}%` },
  ]

  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #22d3ee, #4f8bff)' }} />
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Details</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="rounded-xl p-3 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              {m.icon}
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{m.label}</span>
            </div>
            <p className="text-lg font-bold text-white tracking-tight">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
