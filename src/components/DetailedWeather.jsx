import { Droplets, Wind, Gauge, Eye, Thermometer, Cloud } from 'lucide-react'

export default function DetailedWeather({ data, unit }) {
  if (!data) return null

  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  const metrics = [
    { icon: <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Feels Like', value: `${Math.round(data.main.feels_like)}°`, code: '01' },
    { icon: <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Humidity', value: `${data.main.humidity}%`, code: '02' },
    { icon: <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Wind Vector', value: `${data.wind.speed.toFixed(1)} ${speedUnit}`, code: '03' },
    { icon: <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Barometer', value: `${data.main.pressure} hPa`, code: '04' },
    { icon: <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km`, code: '05' },
    { icon: <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Cloud Cover', value: `${data.clouds.all}%`, code: '06' },
  ]

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
            Atmospheric Sensors
          </h2>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/40">
          Core Metrics
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5 group relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div
                className="p-1.5 sm:p-2 rounded-xl transition-transform group-hover:scale-110"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--theme-accent)',
                }}
              >
                {m.icon}
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono text-white/30 tracking-widest">
                #{m.code}
              </span>
            </div>

            <p className="text-[9px] sm:text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-0.5 sm:mb-1">
              {m.label}
            </p>
            <p className="text-base sm:text-lg md:text-xl font-bold font-mono text-white tracking-tight">
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
