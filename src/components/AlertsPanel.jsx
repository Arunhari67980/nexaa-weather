import { AlertCircle } from 'lucide-react'
import '../styles/AlertsPanel.css'

export default function AlertsPanel({ weather }) {
  const generateAlerts = () => {
    const alerts = []

    if (!weather) return alerts

    if (weather.main.temp < 0) {
      alerts.push({
        type: 'freeze',
        message: '❄️ Freezing temperature: Be aware of ice on roads',
        severity: 'warning',
      })
    }

    if (weather.wind.speed > 10) {
      alerts.push({
        type: 'wind',
        message: '💨 Strong winds detected: Secure loose objects',
        severity: 'warning',
      })
    }

    if (weather.main.humidity > 90) {
      alerts.push({
        type: 'humidity',
        message: '💧 High humidity: Conditions may feel muggy',
        severity: 'info',
      })
    }

    if (weather.clouds.all > 80) {
      alerts.push({
        type: 'clouds',
        message: '☁️ Heavy cloud cover: Limited visibility',
        severity: 'info',
      })
    }

    if (weather.visibility < 1000) {
      alerts.push({
        type: 'visibility',
        message: '🌫️ Low visibility: Use caution while driving',
        severity: 'critical',
      })
    }

    if (weather.main.temp > 35) {
      alerts.push({
        type: 'heat',
        message: '🔥 Extreme heat: Stay hydrated and avoid prolonged sun exposure',
        severity: 'critical',
      })
    }

    return alerts
  }

  const alerts = generateAlerts()

  return (
    <div className="alerts-panel">
      {alerts.length === 0 ? (
        <div className="no-alerts">
          <AlertCircle size={20} />
          <p>No weather alerts at this time</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`alert-item ${alert.severity}`}>
              <AlertCircle size={20} className="alert-icon" />
              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
