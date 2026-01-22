import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TemperatureTrends({ forecastData, unit }) {
  if (!forecastData || !forecastData.list) return null

  // Process data for chart - get one entry per day at 12:00
  const dailyData = {}
  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        date: dayKey,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        description: item.weather[0].description,
      }
    }
  })

  const chartData = Object.values(dailyData).slice(0, 5)

  if (chartData.length === 0) return null

  return (
    <div className="glass-effect p-6 rounded-2xl animate-slide-up">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">📈 5-Day Temperature Trend</h3>
        <p className="text-sm text-gray-400">Temperature forecast over the next 5 days</p>
      </div>

      <div className="w-full h-64 bg-white/5 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px' }}
              label={{ value: tempSymbol, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
              formatter={(value) => `${value}${tempSymbol}`}
              labelStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#60a5fa" 
              strokeWidth={3}
              dot={{ fill: '#60a5fa', r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            />
            <Line 
              type="monotone" 
              dataKey="feelsLike" 
              stroke="#f97316" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#f97316', r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-gray-300">Actual Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full" style={{ dasharray: '5 5' }}></div>
          <span className="text-gray-300">Feels Like</span>
        </div>
      </div>

      {/* Daily forecast details */}
      <div className="mt-6 space-y-2">
        {chartData.map((day, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <span className="font-medium text-white">{day.date}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 capitalize">{day.description}</span>
              <span className="font-semibold text-blue-400">{day.temp}{tempSymbol}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
