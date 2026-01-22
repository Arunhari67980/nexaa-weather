import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Loader } from 'lucide-react'
import { searchCities } from '../api/weatherApi'

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceTimer = useRef(null)

  // Debounced search function
  const performSearch = async (query) => {
    if (query.trim().length === 0) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const results = await searchCities(query)
      setSuggestions(results)
    } catch (error) {
      console.error('Search error:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new debounced search - 300ms delay
    debounceTimer.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  const handleSearch = (city = null) => {
    const searchCity = city || input
    if (searchCity.trim()) {
      onSearch(searchCity)
      setInput('')
      setSuggestions([])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        {loading && (
          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" />
        )}
        <input
          type="text"
          placeholder="Search city..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 border border-white/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((city, idx) => (
            <button
              key={`${city.name}-${city.country}-${idx}`}
              onClick={() => {
                handleSearch(city.fullName)
                setInput('')
                setSuggestions([])
              }}
              className="w-full px-4 py-2.5 text-left text-white hover:bg-blue-500/30 flex items-center gap-2 transition border-b border-white/5 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{city.name}</div>
                {city.country && (
                  <div className="text-xs text-gray-400 truncate">{city.country}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
