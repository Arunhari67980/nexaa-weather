import { Droplets, Wind, Gauge, Eye, Thermometer, Cloud } from 'lucide-react'

export default function DetailedWeather({ data, unit }) {
  if (!data) return null

  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  const metrics = [
    { icon: <Thermometer className="w-5 h-5" />, label: 'Feels Like', value: `${Math.round(data.main.feels_like)}°`, color: 'rose' },
    { icon: <Droplets className="w-5 h-5" />, label: 'Humidity', value: `${data.main.humidity}%`, color: 'cyan' },
    { icon: <Wind className="w-5 h-5" />, label: 'Wind Speed', value: `${data.wind.speed.toFixed(1)} ${speedUnit}`, color: 'blue' },
    { icon: <Gauge className="w-5 h-5" />, label: 'Pressure', value: `${data.main.pressure} hPa`, color: 'violet' },
    { icon: <Eye className="w-5 h-5" />, label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km`, color: 'indigo' },
    { icon: <Cloud className="w-5 h-5" />, label: 'Cloud Cover', value: `${data.clouds.all}%`, color: 'slate' },
  ]

  const colorMap = {
    rose: { bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.2)', text: '#fb7185' },
    cyan: { bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee' },
    blue: { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
    violet: { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa' },
    indigo: { bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.2)', text: '#818cf8' },
    slate: { bg: 'rgba(148, 163, 184, 0.08)', border: 'rgba(148, 163, 184, 0.2)', text: '#cbd5e1' },
  }

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 rounded-full"
          style={{ background: 'linear-gradient(180deg, #06b6d4, #3b82f6)' }} />
        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
          Detailed Metrics
        </h3>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, idx) => {
          const colors = colorMap[m.color]
          return (
            <div
              key={idx}
              className="rounded-2xl p-4 transition-all hover:scale-105 cursor-pointer group"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg group-hover:scale-110 transition-transform"
                  style={{
                    background: colors.bg,
                    color: colors.text
                  }}>
                  {m.icon}
                </div>
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-xl font-bold text-white" style={{ color: colors.text }}>
                {m.value}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
