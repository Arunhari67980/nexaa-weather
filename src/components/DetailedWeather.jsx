import { Droplets, Wind, Gauge, Eye, Thermometer, Cloud, SunDim } from 'lucide-react'

export default function DetailedWeather({
  data,
  unit = 'metric',
  windUnit = 'm/s',
  pressureUnit = 'mb',
}) {
  if (!data) return null

  // Safe extraction with robust fallbacks
  const rawSpeed = data.wind?.speed ?? 0
  const baseSpeed = unit === 'metric' ? rawSpeed : rawSpeed * 0.44704
  let displaySpeed = baseSpeed.toFixed(1)
  let speedLabel = windUnit

  if (windUnit === 'km/h') {
    displaySpeed = (baseSpeed * 3.6).toFixed(1)
  } else if (windUnit === 'mph') {
    displaySpeed = (baseSpeed * 2.23694).toFixed(1)
  } else {
    displaySpeed = baseSpeed.toFixed(1)
    speedLabel = 'm/s'
  }

  // Pressure conversion from hPa / mb
  const rawPressure = data.main?.pressure ?? 1013
  let displayPressure = `${rawPressure} mb`
  if (pressureUnit === 'inHg') {
    displayPressure = `${(rawPressure * 0.02953).toFixed(2)} inHg`
  } else if (pressureUnit === 'mmHg') {
    displayPressure = `${Math.round(rawPressure * 0.75006)} mmHg`
  }

  // Dew point approximation
  const rawTemp = data.main?.temp ?? (unit === 'metric' ? 18 : 64)
  const rawHumidity = data.main?.humidity ?? 50
  const tempC = unit === 'metric' ? rawTemp : ((rawTemp - 32) * 5) / 9
  const dewPointC = Math.round(tempC - (100 - rawHumidity) / 5)
  const displayDewPoint = unit === 'metric' ? `${dewPointC}°C` : `${Math.round((dewPointC * 9) / 5 + 32)}°F`

  const metrics = [
    {
      icon: <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Feels Like',
      value: `${Math.round(data.main?.feels_like ?? rawTemp)}°`,
      code: '01',
    },
    {
      icon: <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Humidity',
      value: `${rawHumidity}%`,
      code: '02',
    },
    {
      icon: <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Wind Vector',
      value: `${displaySpeed} ${speedLabel}`,
      code: '03',
    },
    {
      icon: <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Barometer',
      value: displayPressure,
      code: '04',
    },
    {
      icon: <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Visibility',
      value: `${((data.visibility ?? 10000) / 1000).toFixed(1)} km`,
      code: '05',
    },
    {
      icon: <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Cloud Cover',
      value: `${data.clouds?.all ?? 0}%`,
      code: '06',
    },
    {
      icon: <SunDim className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Dew Point',
      value: displayDewPoint,
      code: '07',
    },
    {
      icon: <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      label: 'Sea Pressure',
      value: `${data.main?.sea_level || rawPressure} hPa`,
      code: '08',
    },
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
          Telemetry Grid
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:border-white/20 sm:hover:-translate-y-0.5 group relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div
                className="p-1.5 sm:p-2 rounded-xl transition-transform sm:group-hover:scale-110"
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
            <p className="text-sm sm:text-base md:text-lg font-bold font-mono text-white tracking-tight truncate">
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
