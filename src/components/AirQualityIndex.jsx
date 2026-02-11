import { Wind } from 'lucide-react'
import { getAQILevel } from '../utils/weatherUtils'

export default function AirQualityIndex({ aqi }) {
  if (!aqi) return null

  const level = getAQILevel(aqi.list[0].main.aqi)
  const pollutants = aqi.list[0].components
  const aqiValue = aqi.list[0].main.aqi

  const colors = {
    1: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', text: '#4ade80', label: 'Good', emoji: '😊' },
    2: { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.15)', text: '#facc15', label: 'Fair', emoji: '🙂' },
    3: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)', text: '#fb923c', label: 'Moderate', emoji: '😐' },
    4: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', text: '#f87171', label: 'Poor', emoji: '😷' },
    5: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.15)', text: '#c084fc', label: 'Very Poor', emoji: '😫' },
  }

  const c = colors[aqiValue] || colors[1]

  const recommendations = {
    1: 'Air quality is satisfactory — perfect for outdoor activities.',
    2: 'Acceptable air quality. Enjoy the outdoors.',
    3: 'Sensitive groups should limit prolonged outdoor exertion.',
    4: 'Most people should avoid prolonged outdoor activity.',
    5: 'Everyone should avoid outdoor activities.',
  }

  return (
    <div className="glass-panel rounded-3xl p-6 animate-scale-in" style={{ borderLeft: `3px solid ${c.text}` }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full" style={{ background: c.text }} />
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Air Quality</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <span className="text-sm">{c.emoji}</span>
          <span className="text-xs font-bold" style={{ color: c.text }}>{c.label}</span>
        </div>
      </div>

      {/* AQI Bar */}
      <div className="mb-5">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{
            width: `${(aqiValue / 5) * 100}%`,
            background: `linear-gradient(90deg, #4ade80, ${c.text})`,
          }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-gray-600">Good</span>
          <span className="text-[10px] text-gray-600">Hazardous</span>
        </div>
      </div>

      {/* Key pollutants */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'PM2.5', value: pollutants.pm2_5?.toFixed(1) },
          { label: 'PM10', value: pollutants.pm10?.toFixed(1) },
          { label: 'O₃', value: pollutants.o3?.toFixed(1) },
        ].map((p, i) => (
          <div key={i} className="rounded-lg p-2 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-[10px] text-gray-500 font-bold uppercase">{p.label}</p>
            <p className="text-sm font-bold text-white">{p.value || '—'}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 font-medium leading-relaxed">
        {recommendations[aqiValue] || recommendations[1]}
      </p>
    </div>
  )
}
