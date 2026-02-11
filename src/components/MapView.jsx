import { MapPin } from 'lucide-react'

export default function MapView({ data, city }) {
  if (!data) return null

  const stats = [
    { label: 'Temperature', value: `${Math.round(data.main.temp)}°C` },
    { label: 'Condition', value: data.weather[0].main },
    { label: 'Humidity', value: `${data.main.humidity}%` },
    { label: 'Wind', value: `${data.wind.speed.toFixed(1)} m/s` },
  ]

  return (
    <div className="glass-panel rounded-3xl p-8 animate-scale-in">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-5 h-5 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">{city}</h2>
      </div>

      <div className="rounded-2xl p-6 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-gray-400 text-sm mb-5 font-medium tabular-nums">
          📍 {data.coord.lat.toFixed(4)}° N, {data.coord.lon.toFixed(4)}° E
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xl font-bold text-white capitalize">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-xs text-center font-medium">
        🗺️ Interactive map coming soon
      </p>
    </div>
  )
}
