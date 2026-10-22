import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { getWeatherIcon } from '../api/weatherApi'

export default function ComparisonView({
  isOpen,
  onClose,
  currentCity,
  currentWeather,
  unit,
  onLoadCity,
}) {
  const [comparisonCity, setComparisonCity] = useState('')
  const [comparisonWeather, setComparisonWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  const handleLoad = async () => {
    if (!comparisonCity.trim()) return
    setLoading(true)
    try {
      const data = await onLoadCity(comparisonCity)
      setComparisonWeather(data)
    } catch {
      alert('Could not retrieve telemetry for ' + comparisonCity)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in"
        style={{
          background: 'rgba(18, 14, 12, 0.96)',
          border: '1px solid var(--theme-glass-border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px var(--theme-glow)',
        }}
      >
        <div className="top-edge-flare" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-5 border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">⚡</span>
            <h2 className="text-xs sm:text-base font-bold font-mono tracking-wider uppercase text-white">
              Comparative Telemetry Engine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
            <input
              type="text"
              value={comparisonCity}
              onChange={(e) => setComparisonCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
              placeholder="Enter comparison station..."
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-mono text-white placeholder-white/30 bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
            />
            <button
              onClick={handleLoad}
              disabled={loading || !comparisonCity.trim()}
              className="py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl sm:rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-secondary))',
              }}
            >
              {loading ? 'Transmitting...' : 'Analyze'}
            </button>
          </div>

          {/* Comparative Cards */}
          {comparisonWeather && currentWeather && (
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <CityCard
                  name={currentCity}
                  weather={currentWeather}
                  tempSymbol={tempSymbol}
                  accent="var(--theme-accent)"
                  tag="PRIMARY STATION"
                />
                <CityCard
                  name={comparisonCity}
                  weather={comparisonWeather}
                  tempSymbol={tempSymbol}
                  accent="#38bdf8"
                  tag="TARGET STATION"
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <Metric
                  label="Apparent Heat"
                  v1={`${Math.round(currentWeather.main.feels_like)}°`}
                  v2={`${Math.round(comparisonWeather.main.feels_like)}°`}
                />
                <Metric
                  label="Moisture"
                  v1={`${currentWeather.main.humidity}%`}
                  v2={`${comparisonWeather.main.humidity}%`}
                />
                <Metric
                  label="Wind Vector"
                  v1={`${currentWeather.wind.speed.toFixed(1)} ${speedUnit}`}
                  v2={`${comparisonWeather.wind.speed.toFixed(1)} ${speedUnit}`}
                />
                <Metric
                  label="Barometer"
                  v1={`${currentWeather.main.pressure} hPa`}
                  v2={`${comparisonWeather.main.pressure} hPa`}
                />
                <Metric
                  label="Visibility"
                  v1={`${(currentWeather.visibility / 1000).toFixed(1)} km`}
                  v2={`${(comparisonWeather.visibility / 1000).toFixed(1)} km`}
                />
                <Metric
                  label="Clouds"
                  v1={`${currentWeather.clouds.all}%`}
                  v2={`${comparisonWeather.clouds.all}%`}
                />
              </div>

              {/* Briefing Summary */}
              <div className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 bg-white/5 border border-white/10 font-mono text-xs">
                <p className="font-bold text-white mb-1.5 uppercase tracking-wider text-[11px]">
                  Telemetry Synthesis
                </p>
                <ul className="space-y-1 text-white/70 text-[11px] sm:text-xs">
                  <li>
                    🌡️{' '}
                    {currentWeather.main.temp > comparisonWeather.main.temp
                      ? currentCity
                      : comparisonCity}{' '}
                    registers higher ambient heat.
                  </li>
                  <li>
                    💨{' '}
                    {currentWeather.wind.speed > comparisonWeather.wind.speed
                      ? currentCity
                      : comparisonCity}{' '}
                    exhibits higher aerodynamic wind speed.
                  </li>
                  <li>
                    💧{' '}
                    {currentWeather.main.humidity > comparisonWeather.main.humidity
                      ? currentCity
                      : comparisonCity}{' '}
                    has denser atmospheric moisture.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CityCard({ name, weather, tempSymbol, accent, tag }) {
  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white/5 border border-white/10 relative overflow-hidden">
      <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
        {tag}
      </span>
      <h3 className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 mb-1">{name}</h3>
      <p className="text-xs text-white/50 capitalize mb-2 font-medium">
        {weather.weather[0].description}
      </p>
      <div className="text-3xl sm:text-4xl mb-2 weather-icon">{getWeatherIcon(weather.weather[0].icon)}</div>
      <p className="text-3xl sm:text-4xl font-bold font-mono tracking-tighter" style={{ color: accent }}>
        {Math.round(weather.main.temp)}
        {tempSymbol}
      </p>
    </div>
  )
}

function Metric({ label, v1, v2 }) {
  return (
    <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 bg-white/5 border border-white/5">
      <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex justify-between items-center font-mono">
        <span className="text-xs sm:text-sm font-bold text-white">{v1}</span>
        <span className="text-[10px] text-white/30">vs</span>
        <span className="text-xs sm:text-sm font-bold text-cyan-400">{v2}</span>
      </div>
    </div>
  )
}
