import { AlertTriangle, AlertCircle } from 'lucide-react'

export default function AlertsBanner({ weather }) {
  const generateAlerts = () => {
    const alerts = []
    if (!weather) return alerts

    if (weather.main.temp < 0) {
      alerts.push({ type: 'freeze', message: 'Sub-Zero Freeze Advisory — Frostbite precaution in effect.', severity: 'warning' })
    }
    if (weather.wind.speed > 10) {
      alerts.push({ type: 'wind', message: 'High Velocity Gale Advisory — Secure exterior equipment and objects.', severity: 'warning' })
    }
    if (weather.visibility < 1000) {
      alerts.push({ type: 'visibility', message: 'Low Visibility Dense Fog Alert — Reduce travel speeds.', severity: 'critical' })
    }
    if (weather.main.temp > 35) {
      alerts.push({ type: 'heat', message: 'Extreme Heatwave Advisory — Hydration vigilance strongly recommended.', severity: 'critical' })
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
