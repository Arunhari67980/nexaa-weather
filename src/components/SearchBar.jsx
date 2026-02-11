import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader } from 'lucide-react'
import { searchCities } from '../api/weatherApi'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInput = (value) => {
    setQuery(value)
    setSelectedIdx(-1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const results = await searchCities(value)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch { setSuggestions([]) }
      finally { setLoading(false) }
    }, 300)
  }

  const submit = (city) => {
    onSearch(city)
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (selectedIdx >= 0 && suggestions[selectedIdx]) {
        submit(suggestions[selectedIdx].name)
      } else if (query.trim()) {
        submit(query.trim())
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input */}
      <div className="glass-card flex items-center gap-3 rounded-2xl px-5 py-3 border border-white/12"
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          transition: 'all 0.3s ease'
        }}>
        <Search className="w-5 h-5 text-blue-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search cities..."
          className="flex-1 bg-transparent text-base text-white placeholder-gray-400 font-medium focus:outline-none"
          style={{ fontSize: '15px', letterSpacing: '0.3px' }}
        />
        {loading && (
          <Loader className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
        )}
        {query && !loading && (
          <button 
            onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false) }}
            className="p-1 hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 glass-card rounded-2xl overflow-hidden z-50 animate-scale-in"
          style={{
            border: '1px solid rgba(59, 130, 246, 0.3)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 14, 39, 0.85) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(32px)'
          }}>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {suggestions.slice(0, 8).map((city, idx) => (
              <button
                key={`${city.name}-${city.country}`}
                onClick={() => submit(city.name)}
                className={`w-full text-left px-5 py-3.5 flex items-center justify-between transition-all border-b border-white/5 last:border-b-0 ${
                  idx === selectedIdx
                    ? 'bg-blue-500/15 text-white'
                    : 'text-gray-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div>
                  <p className="font-semibold text-sm">{city.name}</p>
                  <p className="text-xs text-gray-500">{city.country}</p>
                </div>
                <span className="text-2xl">📍</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
