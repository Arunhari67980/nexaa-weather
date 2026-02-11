import { Clock, Star, X } from 'lucide-react'

export default function RecentSearches({ onSelect, recentSearches = [], favorites = [] }) {
  if (recentSearches.length === 0 && favorites.length === 0) return null

  return (
    <div className="glass-panel rounded-3xl p-6">
      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #fbbf24, #f59e0b)' }} />
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Favorites</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(city)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', color: '#fbbf24' }}
              >
                <Star className="w-3 h-3" fill="currentColor" />
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Recent</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 6).map((city, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(city)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 transition-all hover:text-white hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <Clock className="w-3 h-3" />
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
