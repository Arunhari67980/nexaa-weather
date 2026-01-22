import { AlertCircle, AlertTriangle } from 'lucide-react'

export default function AlertsBanner({ weather }) {
  const generateAlerts = () => {
    const alerts = []

    if (!weather) return alerts

    if (weather.main.temp < 0) {
      alerts.push({
        type: 'freeze',
        message: 'Freezing temperature detected',
        severity: 'warning',
      })
    }

    if (weather.wind.speed > 10) {
      alerts.push({
        type: 'wind',
        message: 'Strong winds: Secure loose objects',
        severity: 'warning',
      })
    }

    if (weather.visibility < 1000) {
      alerts.push({
        type: 'visibility',
        message: 'Low visibility detected',
        severity: 'critical',
      })
    }

    if (weather.main.temp > 35) {
      alerts.push({
        type: 'heat',
        message: 'Extreme heat: Stay hydrated',
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
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${
            alert.severity === 'critical'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}
        >
          {alert.severity === 'critical' ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          )}
          <p className={alert.severity === 'critical' ? 'text-red-200' : 'text-yellow-200'}>
            {alert.message}
          </p>
        </div>
      ))}
    </div>
  )
}
