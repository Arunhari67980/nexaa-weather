import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

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
        <div className="rounded-2xl p-4 text-sm backdrop-blur-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 14, 39, 0.9) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
          }}>
          <p className="text-gray-300 text-xs font-bold mb-2 uppercase tracking-wide">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="font-bold text-base" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name === 'Humidity' ? '%' : '°'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full"
            style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Temperature Trends</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#3b82f6' }} />
            <span className="text-xs text-gray-400 font-semibold uppercase">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-3 h-3">
              <svg className="w-full h-full" viewBox="0 0 12 2" style={{ stroke: '#a78bfa' }}>
                <line x1="0" y1="1" x2="12" y2="1" strokeWidth="2" strokeDasharray="2 2" />
              </svg>
            </div>
            <span className="text-xs text-gray-400 font-semibold uppercase">Feels Like</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 -mx-4 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="rgba(255, 255, 255, 0.1)"
              tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.1)"
              tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.05)' }}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              name="Temperature"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#3b82f6',
                stroke: 'rgba(255, 255, 255, 0.1)',
                strokeWidth: 2
              }}
            />
            <Line
              type="monotone"
              dataKey="feels"
              name="Feels Like"
              stroke="#a78bfa"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#a78bfa',
                stroke: 'rgba(255, 255, 255, 0.1)',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-400 text-center">16-hour temperature and feels-like temperature forecast</p>
    </div>
  )
}
