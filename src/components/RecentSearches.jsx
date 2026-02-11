import { Clock, Star, MapPin } from 'lucide-react'

export default function RecentSearches({ onSelect, recentSearches = [], favorites = [] }) {
  if (recentSearches.length === 0 && favorites.length === 0) return null

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded-full"
              style={{ background: 'linear-gradient(180deg, #fbbf24, #f59e0b)' }} />
            <h3 className="text-base font-bold text-white uppercase tracking-tight">⭐ Favorites</h3>
          </div>
          <div className="space-y-2">
            {favorites.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(city)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all hover:scale-105 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.2)'
                }}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-amber-300" fill="currentColor" />
                  <span className="text-sm font-semibold text-amber-200">{city}</span>
                </div>
                <MapPin className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded-full"
              style={{ background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(6, 182, 212, 0.6))' }} />
            <h3 className="text-base font-bold text-white uppercase tracking-tight">🕐 Recent Searches</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {recentSearches.slice(0, 8).map((city, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(city)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:scale-105 group"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{city}</span>
                </div>
                <MapPin className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
