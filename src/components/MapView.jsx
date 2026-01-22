import { MapPin, Compass } from 'lucide-react'

export default function MapView({ data, city }) {
  if (!data) return null

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">{city}</h2>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <p className="text-gray-300 mb-4">
          Latitude: {data.coord.lat.toFixed(4)}° | Longitude: {data.coord.lon.toFixed(4)}°
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Temperature</p>
            <p className="text-3xl font-bold text-white">{Math.round(data.main.temp)}°C</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Condition</p>
            <p className="text-lg font-bold text-white capitalize">{data.weather[0].main}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Humidity</p>
            <p className="text-3xl font-bold text-white">{data.main.humidity}%</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Wind Speed</p>
            <p className="text-3xl font-bold text-white">{data.wind.speed.toFixed(1)} m/s</p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-6 text-center">
          📍 Map integration coming soon
        </p>
      </div>
    </div>
  )
}
