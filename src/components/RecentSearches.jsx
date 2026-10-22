import { Clock, Star, MapPin } from 'lucide-react'

export default function RecentSearches({ onSelect, recentSearches = [], favorites = [] }) {
  if (recentSearches.length === 0 && favorites.length === 0) return null

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 overflow-hidden">
      <div className="top-edge-flare" />

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-3">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Starred Stations
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(city)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-400/10 border border-amber-400/30 text-amber-200 hover:bg-amber-400/20 transition-all flex items-center gap-1.5"
              >
                <span>⭐</span>
                <span>{city}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Clock className="w-3.5 h-3.5 text-white/50" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Recent Exploration
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 8).map((city, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(city)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3 h-3 text-white/40" />
                <span>{city}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
