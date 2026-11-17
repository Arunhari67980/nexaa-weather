import { AlertTriangle, AlertCircle } from 'lucide-react'

export default function AlertsBanner({
  weather,
  alertSettings = { freeze: true, wind: true, rain: true, heat: true, visibility: true },
}) {
  const settings = alertSettings || { freeze: true, wind: true, rain: true, heat: true, visibility: true }

  const generateAlerts = () => {
    const alerts = []
    if (!weather) return alerts

    const mainCond = weather.weather?.[0]?.main?.toLowerCase() || ''
    const descCond = weather.weather?.[0]?.description?.toLowerCase() || ''
    const temp = weather.main?.temp
    const speed = weather.wind?.speed ?? 0
    const visibility = weather.visibility ?? 10000

    if (settings.freeze && temp !== undefined && temp < 0) {
      alerts.push({
        type: 'freeze',
        message: '❄️ Sub-Zero Freeze Advisory — Frostbite precaution in effect; watch for ice on roads.',
        severity: 'warning',
      })
    }
    if (settings.wind && speed > 10) {
      alerts.push({
        type: 'wind',
        message: '💨 High Velocity Gale Advisory — Strong winds detected; secure exterior equipment.',
        severity: 'warning',
      })
    }
    if (
      settings.rain &&
      (mainCond.includes('storm') ||
        mainCond.includes('thunder') ||
        descCond.includes('heavy rain') ||
        descCond.includes('torrential'))
    ) {
      alerts.push({
        type: 'rain',
        message: '🌧️ Heavy Precipitation & Storm Alert — Active electrical discharges and heavy downpours.',
        severity: 'critical',
      })
    }
    if (settings.visibility && visibility < 1000) {
      alerts.push({
        type: 'visibility',
        message: '🌫️ Low Visibility Dense Fog Alert — Optical visibility under 1 km; reduce travel speeds.',
        severity: 'critical',
      })
    }
    if (settings.heat && temp !== undefined && temp > 35) {
      alerts.push({
        type: 'heat',
        message: '🔥 Extreme Heatwave Advisory — Dangerous heat index; hydration vigilance strongly recommended.',
        severity: 'critical',
      })
    }
    return alerts
  }

  const alerts = generateAlerts()
  if (alerts.length === 0) return null

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium ${
            alert.severity === 'critical' ? 'alert-critical' : 'alert-warning'
          }`}
        >
          {alert.severity === 'critical' ? (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className={alert.severity === 'critical' ? 'text-red-200' : 'text-amber-200'}>
            {alert.message}
          </span>
        </div>
      ))}
    </div>
  )
}
