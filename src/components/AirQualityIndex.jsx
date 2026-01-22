import { Wind, AlertCircle, Activity } from 'lucide-react'
import { getAQILevel } from '../utils/weatherUtils'

export default function AirQualityIndex({ aqi }) {
  if (!aqi) return null

  const level = getAQILevel(aqi.list[0].main.aqi)
  const pollutants = aqi.list[0].components

  // AQI scale colors
  const colors = {
    1: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', label: '😊 Good' },
    2: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', label: '🙂 Fair' },
    3: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', label: '😐 Moderate' },
    4: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', label: '😷 Poor' },
    5: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', label: '😫 Very Poor' }
  }

  const color = colors[level.value]

  // Health recommendations based on AQI
  const recommendations = {
    1: 'Air quality is satisfactory. Perfect for outdoor activities.',
    2: 'Air quality is acceptable. You can enjoy outdoor activities.',
    3: 'Air quality is moderately polluted. Sensitive groups should limit outdoor activities.',
    4: 'Air quality is poor. Most people should avoid prolonged outdoor exertion.',
    5: 'Air quality is very unhealthy. Everyone should avoid outdoor activities.'
  }

  return (
    <div className={`glass-effect border ${color.border} p-6 rounded-xl animate-scale-in`}>
      <div className="flex items-center gap-3 mb-4">
        <Wind className={`w-6 h-6 ${color.text}`} />
        <h3 className="text-xl font-bold text-white">Air Quality Index</h3>
      </div>

      {/* Main AQI Display */}
      <div className={`${color.bg} border ${color.border} rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold ${color.text}`}>Current AQI Level</p>
            <p className={`text-3xl font-bold ${color.text}`}>{color.label}</p>
          </div>
          <div className="text-5xl">{level.emoji}</div>
        </div>
      </div>

      {/* Health Recommendation */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
        <div className="flex gap-2">
          <Activity className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-200">{recommendations[level.value]}</p>
        </div>
      </div>

      {/* Pollutant Details */}
      <div className="grid grid-cols-2 gap-3">
        <PollutantCard
          name="PM2.5"
          value={pollutants.pm2_5 ? pollutants.pm2_5.toFixed(1) : 'N/A'}
          unit="µg/m³"
          description="Fine particulates"
        />
        <PollutantCard
          name="PM10"
          value={pollutants.pm10 ? pollutants.pm10.toFixed(1) : 'N/A'}
          unit="µg/m³"
          description="Coarse particulates"
        />
        <PollutantCard
          name="NO₂"
          value={pollutants.no2 ? pollutants.no2.toFixed(1) : 'N/A'}
          unit="µg/m³"
          description="Nitrogen dioxide"
        />
        <PollutantCard
          name="O₃"
          value={pollutants.o3 ? pollutants.o3.toFixed(1) : 'N/A'}
          unit="µg/m³"
          description="Ozone"
        />
        <PollutantCard
          name="SO₂"
          value={pollutants.so2 ? pollutants.so2.toFixed(1) : 'N/A'}
          unit="µg/m³"
          description="Sulfur dioxide"
        />
        <PollutantCard
          name="CO"
          value={pollutants.co ? (pollutants.co / 1000).toFixed(1) : 'N/A'}
          unit="mg/m³"
          description="Carbon monoxide"
        />
      </div>

      {/* Health Groups Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-2">⚠️ Sensitive groups:</p>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Children & elderly people</li>
          <li>• People with respiratory conditions</li>
          <li>• People with heart disease</li>
        </ul>
      </div>
    </div>
  )
}

function PollutantCard({ name, value, unit, description }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition">
      <p className="font-semibold text-white text-sm">{name}</p>
      <p className="text-xs text-gray-400 mb-2">{description}</p>
      <p className="text-lg font-bold text-blue-400">
        {value} <span className="text-xs text-gray-400">{unit}</span>
      </p>
    </div>
  )
}
