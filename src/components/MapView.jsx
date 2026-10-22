import { MapPin, Navigation, Globe, Compass } from 'lucide-react'

export default function MapView({ data, city }) {
  if (!data) return null

  const stats = [
    { label: 'Surface Temp', value: `${Math.round(data.main.temp)}°` },
    { label: 'Sky State', value: data.weather[0].main },
    { label: 'Relative Humidity', value: `${data.main.humidity}%` },
    { label: 'Wind Velocity', value: `${data.wind.speed.toFixed(1)} m/s` },
  ]

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 animate-scale-in">
      <div className="top-edge-flare" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-5 rounded-full"
            style={{ background: 'var(--theme-accent)' }}
          />
          <h2 className="text-base sm:text-lg font-bold font-mono tracking-wider uppercase text-white">
            Geospatial Radar · {city}
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
          <Globe className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
          <span>Orbital Tracking</span>
        </div>
      </div>

      {/* Coordinates Radar Card */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.5) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Subtle Radar Concentric Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-48 h-48 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="w-80 h-80 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center py-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-secondary))',
              color: '#0d0a09',
            }}
          >
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>

          <h3 className="text-2xl font-bold font-mono text-white tracking-tight mb-1">
            {city}
          </h3>

          <p className="text-sm font-mono text-white/50 tracking-wider">
            LAT: {data.coord.lat.toFixed(4)}° N · LON: {data.coord.lon.toFixed(4)}° E
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10 pt-4 border-t border-white/10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-3 bg-white/5 border border-white/5 text-center"
            >
              <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className="text-base sm:text-lg font-bold font-mono text-white capitalize">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
