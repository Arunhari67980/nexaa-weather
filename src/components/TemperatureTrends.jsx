import { useState } from 'react'
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts'
import { Thermometer, CloudRain, Droplets } from 'lucide-react'

function CustomTooltip({ active, payload, label, activeMetric, tempSymbol }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-2xl p-2.5 sm:p-3.5 text-xs font-mono backdrop-blur-2xl border"
        style={{
          background: 'rgba(16, 12, 10, 0.96)',
          borderColor: 'var(--theme-accent)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 15px var(--theme-glow)',
        }}
      >
        <p className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="font-bold text-xs sm:text-sm my-0.5" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {activeMetric === 'temp'
              ? tempSymbol
              : activeMetric === 'humidity'
              ? '%'
              : ' mm'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function TemperatureTrends({ data, unit }) {
  const [activeMetric, setActiveMetric] = useState('temp') // 'temp' | 'rain' | 'humidity'

  if (!data || !data.list) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  const chartData = data.list.slice(0, 16).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    feels: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    rain: Number((item.rain?.['3h'] || item.pop * 2.5 || 0).toFixed(1)),
  }))

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 overflow-hidden">
      {/* Top Edge Highlight */}
      <div className="top-edge-flare" />

      {/* Header with Multi-Metric Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-1.5 h-4 sm:h-5 rounded-full"
            style={{ background: 'var(--theme-accent)' }}
          />
          <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
            Meteorological Trajectory
          </h2>
        </div>

        {/* Metric Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
              activeMetric === 'temp'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Thermometer className="w-3 h-3 text-amber-400" />
            <span>Thermal</span>
          </button>
          <button
            onClick={() => setActiveMetric('rain')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
              activeMetric === 'rain'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <CloudRain className="w-3 h-3 text-cyan-400" />
            <span>Rainfall</span>
          </button>
          <button
            onClick={() => setActiveMetric('humidity')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
              activeMetric === 'humidity'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Droplets className="w-3 h-3 text-blue-400" />
            <span>Moisture</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-52 sm:h-72 -mx-3 sm:-mx-4">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 15, bottom: 0, left: -22 }}>
              <defs>
                <linearGradient id="themeTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="rgba(255, 255, 255, 0.1)"
                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 9, fontFamily: 'monospace' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.1)"
                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 9, fontFamily: 'monospace' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                tickLine={false}
                domain={['auto', 'auto']}
                width={35}
              />
              <Tooltip content={<CustomTooltip activeMetric={activeMetric} tempSymbol={tempSymbol} />} />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="var(--theme-accent)"
                strokeWidth={2}
                fill="url(#themeTempGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'var(--theme-accent)',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="feels"
                name="Feels Like"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={1.2}
                strokeDasharray="3 3"
                dot={false}
                activeDot={{
                  r: 3,
                  fill: '#ffffff',
                }}
              />
            </AreaChart>
          ) : activeMetric === 'rain' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 15, bottom: 0, left: -22 }}>
              <XAxis
                dataKey="time"
                stroke="rgba(255, 255, 255, 0.1)"
                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 9, fontFamily: 'monospace' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.1)"
                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 9, fontFamily: 'monospace' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                tickLine={false}
                width={35}
              />
              <Tooltip content={<CustomTooltip activeMetric={activeMetric} tempSymbol={tempSymbol} />} />
              <Bar dataKey="rain" name="Rainfall" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 15, bottom: 0, left: -22 }}>
              <defs>
                <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="rgba(255, 255, 255, 0.1)"
                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 9, fontFamily: 'monospace' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.1)"
                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 9, fontFamily: 'monospace' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
                tickLine={false}
                domain={[0, 100]}
                width={35}
              />
              <Tooltip content={<CustomTooltip activeMetric={activeMetric} tempSymbol={tempSymbol} />} />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="url(#humidityGrad)"
                dot={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
