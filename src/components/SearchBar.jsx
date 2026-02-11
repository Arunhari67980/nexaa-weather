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
    <div ref={wrapperRef} className="relative">
      <div className="glass-panel flex items-center gap-2.5 rounded-xl px-4 py-2.5"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <Search className="w-4 h-4 text-gray-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search any city..."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 font-medium tracking-wide"
        />
        {loading && <Loader className="w-4 h-4 text-gray-500 animate-spin-slow shrink-0" />}
        {query && !loading && (
          <button onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false) }}>
            <X className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-50 animate-scale-in"
          style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px -12px rgba(0,0,0,0.5)' }}>
          {suggestions.map((city, idx) => (
            <button
              key={`${city.name}-${city.country}`}
              onClick={() => submit(city.name)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition-colors ${idx === selectedIdx ? 'bg-white/8 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="font-medium">{city.name}</span>
              <span className="text-xs text-gray-500">{city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
