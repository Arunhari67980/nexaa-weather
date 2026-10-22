import { getAQILevel } from '../utils/weatherUtils'
import { ShieldCheck } from 'lucide-react'

export default function AirQualityIndex({ aqi }) {
  if (!aqi || !aqi.list || !aqi.list[0]) return null

  const level = getAQILevel(aqi.list[0].main.aqi)
  const pollutants = aqi.list[0].components
  const aqiValue = aqi.list[0].main.aqi

  const colors = {
    1: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', text: '#4ade80', label: 'Good', emoji: '🟢' },
    2: { bg: 'rgba(234, 179, 8, 0.1)', border: '#eab308', text: '#facc15', label: 'Fair', emoji: '🟡' },
    3: { bg: 'rgba(249, 115, 22, 0.1)', border: '#f97316', text: '#fb923c', label: 'Moderate', emoji: '🟠' },
    4: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', text: '#f87171', label: 'Poor', emoji: '🔴' },
    5: { bg: 'rgba(168, 85, 247, 0.1)', border: '#a855f7', text: '#c084fc', label: 'Hazardous', emoji: '🟣' },
  }

  const c = colors[aqiValue] || colors[1]

  const recommendations = {
    1: 'Atmosphere is clean and fresh. Ideal conditions for outdoor cardio and activities.',
    2: 'Air quality is acceptable. Sensitive individuals should monitor respiratory comfort.',
    3: 'Elevated particle concentrations. Limit strenuous exertion outdoors.',
    4: 'Significant pollution levels. Wear particulate protection and keep windows closed.',
    5: 'Hazardous air alert! Avoid all outdoor exposure and activate indoor filtration.',
  }

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden">
      <div className="top-edge-flare" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-1.5 h-4 sm:h-5 rounded-full"
            style={{ background: c.border }}
          />
          <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
            Air Purity Index
          </h2>
        </div>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold"
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
            color: c.text,
            boxShadow: `0 0 15px ${c.border}30`,
          }}
        >
          <span>{c.emoji}</span>
          <span>{c.label}</span>
        </div>
      </div>

      {/* Level Scale */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-wider">
            AQI Telemetry
          </span>
          <span className="text-base sm:text-xl font-bold font-mono" style={{ color: c.text }}>
            Level {aqiValue} / 5
          </span>
        </div>

        <div className="h-1.5 sm:h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(aqiValue / 5) * 100}%`,
              background: `linear-gradient(90deg, #4ade80, ${c.border})`,
              boxShadow: `0 0 15px ${c.border}`,
            }}
          />
        </div>
      </div>

      {/* Pollutant Particles Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4">
        {[
          { label: 'PM2.5', value: pollutants.pm2_5?.toFixed(1), unit: 'μg/m³' },
          { label: 'PM10', value: pollutants.pm10?.toFixed(1), unit: 'μg/m³' },
          { label: 'O₃', value: pollutants.o3?.toFixed(1), unit: 'μg/m³' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-white/15 transition-all"
          >
            <p className="text-[8px] sm:text-[9px] font-mono text-white/40 uppercase tracking-widest mb-0.5">
              {item.label}
            </p>
            <p className="text-sm sm:text-base font-bold font-mono text-white">
              {item.value || '—'}
            </p>
            <p className="text-[7px] sm:text-[8px] font-mono text-white/30">{item.unit}</p>
          </div>
        ))}
      </div>

      {/* Advisory Note */}
      <div
        className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border flex items-start gap-2.5"
        style={{
          background: c.bg,
          borderColor: `${c.border}40`,
        }}
      >
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: c.text }} />
        <p className="text-xs text-white/85 leading-relaxed font-medium">
          {recommendations[aqiValue] || recommendations[1]}
        </p>
      </div>
    </div>
  )
}
