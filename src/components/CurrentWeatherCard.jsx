import { Droplets, Wind, Gauge, Eye } from 'lucide-react'
import { getWeatherIcon } from '../api/weatherApi'

export default function CurrentWeatherCard({ data, unit, city }) {
  if (!data) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  return (
    <div className="glass-card rounded-3xl p-8 md:p-10 overflow-hidden relative group">
      {/* Ambient glow spots */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none"
        style={{ background: 'rgba(79, 139, 255, 0.12)' }} />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none"
        style={{ background: 'rgba(167, 139, 250, 0.1)' }} />

      <div className="relative z-10">
        {/* Top row: condition + icon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              Current
            </span>
            <p className="text-lg md:text-xl text-gray-300 capitalize font-medium">{data.weather[0].description}</p>
          </div>
          <div className="text-7xl md:text-8xl animate-float weather-icon select-none">
            {getWeatherIcon(data.weather[0].icon)}
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-baseline gap-2 mb-10">
          <span className="text-8xl md:text-[120px] font-bold text-white tracking-tighter leading-none text-glow">
            {Math.round(data.main.temp)}
          </span>
          <span className="text-3xl md:text-4xl font-light text-gray-400">{tempSymbol}</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={<Droplets className="w-4 h-4 text-cyan-400" />} label="Humidity" value={`${data.main.humidity}%`} />
          <Stat icon={<Wind className="w-4 h-4 text-blue-400" />} label="Wind" value={`${data.wind.speed.toFixed(1)} ${speedUnit}`} />
          <Stat icon={<Gauge className="w-4 h-4 text-violet-400" />} label="Pressure" value={`${data.main.pressure} mb`} />
          <Stat icon={<Eye className="w-4 h-4 text-indigo-400" />} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-xl p-3.5 transition-colors"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-bold text-white tracking-tight">{value}</p>
    </div>
  )
}
