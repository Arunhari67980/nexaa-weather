import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader, MapPin } from 'lucide-react'
import { searchCities } from '../api/weatherApi'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
        setIsFocused(false)
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
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 280)
  }

  const submit = (city) => {
    onSearch(city)
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setIsFocused(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, -1))
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
      {/* Search Input Box */}
      <div
        className="glass-card flex items-center gap-2.5 sm:gap-3 rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 transition-all duration-300"
        style={{
          borderColor: isFocused ? 'var(--theme-accent)' : 'var(--theme-glass-border)',
          boxShadow: isFocused ? '0 0 25px var(--theme-glow)' : 'none',
        }}
      >
        <Search
          className="w-4 h-4 shrink-0 transition-colors"
          style={{ color: isFocused ? 'var(--theme-accent)' : 'rgba(255,255,255,0.45)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true)
            if (suggestions.length > 0) setShowSuggestions(true)
          }}
          placeholder="Search world cities..."
          className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-white/35 font-medium focus:outline-none"
        />
        {loading && (
          <Loader
            className="w-4 h-4 animate-spin shrink-0"
            style={{ color: 'var(--theme-accent)' }}
          />
        )}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
              setShowSuggestions(false)
            }}
            className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl overflow-hidden z-50 animate-scale-in"
          style={{
            borderColor: 'var(--theme-accent)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 25px var(--theme-glow)',
          }}
        >
          <div className="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-white/5">
            {suggestions.slice(0, 8).map((city, idx) => (
              <button
                key={`${city.name}-${city.country}-${idx}`}
                onClick={() => submit(city.name)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                  idx === selectedIdx
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <div>
                    <p className="font-semibold text-xs sm:text-sm text-white">{city.name}</p>
                    {city.country && (
                      <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                        {city.country}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  SELECT ↵
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
