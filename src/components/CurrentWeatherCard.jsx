import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge } from 'lucide-react'
import { getWeatherIcon } from '../api/weatherApi'

export default function CurrentWeatherCard({ data, unit, city }) {
  if (!data) return null

  const tempSymbol = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  return (
    <div className="group relative bg-linear-to-br from-blue-600/20 via-slate-800/40 to-purple-600/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-blue-400/50 transition-all duration-300 card-hover shadow-2xl hover:shadow-blue-500/30">
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        {/* Location & Description */}
        <div className="mb-6 animate-slide-down">
          <h2 className="text-4xl font-bold text-white mb-1">{city}</h2>
          <p className="text-gray-400 text-lg capitalize">{data.weather[0].description}</p>
        </div>

        {/* Main Temperature Display */}
        <div className="flex items-start justify-between mb-8 animate-scale-in">
          <div>
            <div className="flex items-center gap-4">
              <span className="text-8xl font-bold bg-linear-to-br from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                {Math.round(data.main.temp)}
              </span>
              <div>
                <p className="text-4xl font-light text-gray-300">{tempSymbol}</p>
                <p className="text-gray-400 mt-2 text-sm">
                  Feels like {Math.round(data.main.feels_like)}{tempSymbol}
                </p>
              </div>
            </div>
          </div>

          <div className="text-7xl animate-float">
            {getWeatherIcon(data.weather[0].icon)}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
          <StatBox
            icon={<Droplets className="w-5 h-5" />}
            label="Humidity"
            value={`${data.main.humidity}%`}
            delay={0}
          />
          <StatBox
            icon={<Wind className="w-5 h-5" />}
            label="Wind Speed"
            value={`${data.wind.speed.toFixed(1)} ${speedUnit}`}
            delay={0.1}
          />
          <StatBox
            icon={<Gauge className="w-5 h-5" />}
            label="Pressure"
            value={`${data.main.pressure} mb`}
            delay={0.2}
          />
          <StatBox
            icon={<Eye className="w-5 h-5" />}
            label="Visibility"
            value={`${(data.visibility / 1000).toFixed(1)} km`}
            delay={0.3}
          />
          <StatBox
            icon={<Cloud className="w-5 h-5" />}
            label="Cloud Cover"
            value={`${data.clouds.all}%`}
            delay={0.4}
          />
          <StatBox
            icon={<Sun className="w-5 h-5" />}
            label="UV Index"
            value={data.uvi?.toFixed(1) || 'N/A'}
            delay={0.5}
          />
        </div>

        {/* Min/Max Temps */}
        <div className="mt-6 pt-6 border-t border-white/10 flex gap-4 animate-slide-up">
          <div className="flex-1 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <p className="text-gray-400 text-sm mb-1">High</p>
            <p className="text-2xl font-semibold text-white">
              {Math.round(data.main.temp_max)}{tempSymbol}
            </p>
          </div>
          <div className="flex-1 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <p className="text-gray-400 text-sm mb-1">Low</p>
            <p className="text-2xl font-semibold text-white">
              {Math.round(data.main.temp_min)}{tempSymbol}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon, label, value, delay = 0 }) {
  return (
    <div
      className="card-hover p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-blue-400/30"
      style={{ animation: `slideUp 0.5s ease-out ${delay}s both` }}
    >
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon}
        <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
