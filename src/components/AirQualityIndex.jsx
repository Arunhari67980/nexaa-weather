import { Wind } from 'lucide-react'
import { getAQILevel } from '../utils/weatherUtils'

export default function AirQualityIndex({ aqi }) {
  if (!aqi) return null

  const level = getAQILevel(aqi.list[0].main.aqi)
  const pollutants = aqi.list[0].components
  const aqiValue = aqi.list[0].main.aqi

  const colors = {
    1: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80', label: 'Good', emoji: '😊' },
    2: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: '#facc15', label: 'Fair', emoji: '🙂' },
    3: { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.3)', text: '#fb923c', label: 'Moderate', emoji: '😐' },
    4: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171', label: 'Poor', emoji: '😷' },
    5: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', text: '#c084fc', label: 'Very Poor', emoji: '😫' },
  }

  const c = colors[aqiValue] || colors[1]

  const recommendations = {
    1: 'Air quality is excellent! Perfect conditions for all outdoor activities.',
    2: 'Air quality is acceptable. Enjoy outdoor activities.',
    3: 'Sensitive groups should limit intense outdoor exertion.',
    4: 'Most people should reduce prolonged outdoor activities.',
    5: 'Everyone should avoid outdoor activities and stay indoors.',
  }

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden" style={{
      borderLeft: `4px solid ${c.text}`,
      background: c.bg
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ background: c.text }} />
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Air Quality</h3>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl" style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: `1px solid ${c.border}`
        }}>
          <span className="text-xl">{c.emoji}</span>
          <span className="text-sm font-bold" style={{ color: c.text }}>{c.label}</span>
        </div>
      </div>

      {/* AQI Scale Visualization */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-3">
          <span className="text-xs text-gray-400 font-semibold uppercase">Air Quality Level</span>
          <span className="text-2xl font-bold" style={{ color: c.text }}>{aqiValue}/5</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{
            width: `${(aqiValue / 5) * 100}%`,
            background: `linear-gradient(90deg, #4ade80, ${c.text})`,
            boxShadow: `0 0 20px ${c.text}40`
          }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-500">Good</span>
          <span className="text-[10px] text-gray-500">Very Poor</span>
        </div>
      </div>

      {/* Main Pollutants */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Main Pollutants</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'PM2.5', value: pollutants.pm2_5?.toFixed(1), unit: 'μg/m³' },
            { label: 'PM10', value: pollutants.pm10?.toFixed(1), unit: 'μg/m³' },
            { label: 'O₃', value: pollutants.o3?.toFixed(1), unit: 'μg/m³' },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl p-4 text-center transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">{p.label}</p>
              <p className="text-lg font-bold text-white">{p.value || '—'}</p>
              <p className="text-[9px] text-gray-500 mt-1">{p.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-2xl" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${c.border}`
      }}>
        <p className="text-sm text-gray-100 font-medium leading-relaxed">
          💡 {recommendations[aqiValue] || recommendations[1]}
        </p>
      </div>
    </div>
  )
}
