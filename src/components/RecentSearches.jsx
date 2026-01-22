import { Trash2, Clock, Star, Plus } from 'lucide-react'

export default function RecentSearches({ onSelect, recentSearches = [], favorites = [] }) {
  const handleRemoveRecent = (index) => {
    const newRecent = recentSearches.filter((_, i) => i !== index)
    localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    window.location.reload()
  }

  const handleRemoveFavorite = (city) => {
    const newFavorites = favorites.filter(f => f !== city)
    localStorage.setItem('favoriteSearches', JSON.stringify(newFavorites))
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="animate-slide-in-left">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-semibold text-white">Favorite Locations</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {favorites.map((city) => (
              <button
                key={city}
                onClick={() => onSelect(city)}
                className="card-hover group relative px-3 py-2 bg-white/5 border border-yellow-400/30 rounded-lg hover:border-yellow-400/70 hover:bg-yellow-400/10"
              >
                <div className="text-sm font-medium text-white truncate">{city}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFavorite(city)
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches Section */}
      {recentSearches.length > 0 && (
        <div className="animate-slide-in-left">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Recent Searches</h3>
          </div>
          <div className="space-y-2">
            {recentSearches.slice(0, 5).map((city, idx) => (
              <button
                key={`${city}-${idx}`}
                onClick={() => onSelect(city)}
                className="card-hover w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-blue-400/50 hover:bg-blue-400/10 group"
              >
                <span className="text-sm text-gray-300">{city}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveRecent(idx)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {recentSearches.length === 0 && favorites.length === 0 && (
        <div className="text-center py-6 animate-fade-in">
          <Plus className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Start searching to see recent locations</p>
        </div>
      )}
    </div>
  )
}
