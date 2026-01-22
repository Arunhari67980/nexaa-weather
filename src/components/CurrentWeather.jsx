import { getWeatherIcon } from '../api/weatherApi'
import '../styles/CurrentWeather.css'

export default function CurrentWeather({ data, unit, city }) {
  if (!data) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  return (
    <div className="current-weather">
      <div className="weather-header">
        <div className="location-info">
          <h2>{city}</h2>
          <p className="weather-description">
            {data.weather[0].main} - {data.weather[0].description}
          </p>
        </div>
        <div className="temperature-display">
          <span className="weather-icon">
            {getWeatherIcon(data.weather[0].icon)}
          </span>
          <div className="temperature-info">
            <span className="current-temp">{Math.round(data.main.temp)}{tempSymbol}</span>
            <span className="feels-like">
              Feels like {Math.round(data.main.feels_like)}{tempSymbol}
            </span>
          </div>
        </div>
      </div>

      <div className="weather-stats">
        <div className="stat-card">
          <span className="stat-icon">💧</span>
          <div className="stat-content">
            <p className="stat-label">Humidity</p>
            <p className="stat-value">{data.main.humidity}%</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">💨</span>
          <div className="stat-content">
            <p className="stat-label">Wind Speed</p>
            <p className="stat-value">{data.wind.speed.toFixed(1)} {speedUnit}</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔽</span>
          <div className="stat-content">
            <p className="stat-label">Pressure</p>
            <p className="stat-value">{data.main.pressure} mb</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">👁️</span>
          <div className="stat-content">
            <p className="stat-label">Visibility</p>
            <p className="stat-value">{(data.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🌤️</span>
          <div className="stat-content">
            <p className="stat-label">Cloud Cover</p>
            <p className="stat-value">{data.clouds.all}%</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">☀️</span>
          <div className="stat-content">
            <p className="stat-label">UV Index</p>
            <p className="stat-value">{data.uvi?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
