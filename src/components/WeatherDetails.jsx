import { Sunrise, Sunset, Wind, Droplets, Eye, Gauge } from 'lucide-react'
import '../styles/WeatherDetails.css'

export default function WeatherDetails({ data, unit }) {
  if (!data) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="weather-details">
      <h3>Weather Details</h3>
      <div className="details-grid">
        <div className="detail-item">
          <Sunrise className="detail-icon" />
          <div className="detail-content">
            <p className="detail-label">Sunrise</p>
            <p className="detail-value">{sunrise}</p>
          </div>
        </div>

        <div className="detail-item">
          <Sunset className="detail-icon" />
          <div className="detail-content">
            <p className="detail-label">Sunset</p>
            <p className="detail-value">{sunset}</p>
          </div>
        </div>

        <div className="detail-item">
          <Wind className="detail-icon" />
          <div className="detail-content">
            <p className="detail-label">Wind Direction</p>
            <p className="detail-value">{data.wind.deg || 'N/A'}°</p>
          </div>
        </div>

        <div className="detail-item">
          <Droplets className="detail-icon" />
          <div className="detail-content">
            <p className="detail-label">Dew Point</p>
            <p className="detail-value">{Math.round(data.main.temp - (100 - data.main.humidity) / 5)}{tempSymbol}</p>
          </div>
        </div>

        <div className="detail-item">
          <Eye className="detail-icon" />
          <div className="detail-content">
            <p className="detail-label">Max Temperature</p>
            <p className="detail-value">{Math.round(data.main.temp_max)}{tempSymbol}</p>
          </div>
        </div>

        <div className="detail-item">
          <Gauge className="detail-icon" />
          <div className="detail-content">
            <p className="detail-label">Min Temperature</p>
            <p className="detail-value">{Math.round(data.main.temp_min)}{tempSymbol}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
