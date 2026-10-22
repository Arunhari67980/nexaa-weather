import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function TemperatureTrends({ data, unit }) {
  if (!data || !data.list) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  const chartData = data.list.slice(0, 16).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    feels: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
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
              {entry.name === 'Humidity' ? '%' : tempSymbol}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 overflow-hidden">
      {/* Top Edge Highlight */}
      <div className="top-edge-flare" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-1.5 h-4 sm:h-5 rounded-full"
            style={{ background: 'var(--theme-accent)' }}
          />
          <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
            Thermal Trajectory
          </h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--theme-accent)' }} />
            <span className="text-[9px] sm:text-[10px] font-mono text-white/50 uppercase tracking-wider">
              Temp
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 border-t border-dashed border-white/60" />
            <span className="text-[9px] sm:text-[10px] font-mono text-white/50 uppercase tracking-wider">
              Feels
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-52 sm:h-72 -mx-3 sm:-mx-4">
        <ResponsiveContainer width="100%" height="100%">
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
            <Tooltip content={<CustomTooltip />} />
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
        </ResponsiveContainer>
      </div>
    </div>
  )
}
