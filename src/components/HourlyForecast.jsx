import { getWeatherIcon } from '../api/weatherApi'
import '../styles/HourlyForecast.css'

export default function HourlyForecast({ data, unit }) {
  const tempSymbol = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="hourly-items">
        {data.slice(0, 8).map((item, idx) => {
          const date = new Date(item.dt * 1000)
          const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })

          return (
            <div key={idx} className="hourly-item">
              <p className="hourly-time">{time}</p>
              <span className="hourly-icon">
                {getWeatherIcon(item.weather[0].icon)}
              </span>
              <p className="hourly-temp">
                {Math.round(item.main.temp)}{tempSymbol}
              </p>
              <p className="hourly-description">
                {item.weather[0].main}
              </p>
              <div className="hourly-details">
                <span title="Humidity">💧 {item.main.humidity}%</span>
                <span title="Wind">💨 {item.wind.speed.toFixed(1)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
