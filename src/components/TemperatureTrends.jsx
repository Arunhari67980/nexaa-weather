import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function TemperatureTrends({ data, unit }) {
  if (!data || !data.list) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  const chartData = data.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    feels: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl p-3 text-sm"
          style={{ background: 'rgba(7,11,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <p className="text-gray-400 text-xs font-semibold mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="font-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name === 'Humidity' ? '%' : '°'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #4f8bff, #a78bfa)' }} />
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Temperature Trends</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4f8bff' }} />
            <span className="text-[10px] text-gray-500 font-semibold uppercase">Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#a78bfa' }} />
            <span className="text-[10px] text-gray-500 font-semibold uppercase">Feels</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f8bff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#4f8bff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.1)"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              name="Temp"
              stroke="#4f8bff"
              strokeWidth={2.5}
              fill="url(#tempGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#4f8bff', stroke: '#070b1a', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="feels"
              name="Feels Like"
              stroke="#a78bfa"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 3, fill: '#a78bfa', stroke: '#070b1a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
