import { useState, useEffect, useRef } from 'react'
import { Wind, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

export default function WeatherDock({
  currentSeason,
  onSeasonChange,
  windSpeed,
  onWindSpeedChange,
  onTriggerGust,
  isAutoSync,
  onToggleAutoSync,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const dockRef = useRef(null)

  const seasons = [
    { id: 'autumn', label: 'Autumn', emoji: '🍂', accent: '#f0a352' },
    { id: 'winter', label: 'Winter', emoji: '❄️', accent: '#38bdf8' },
    { id: 'spring', label: 'Spring', emoji: '🌸', accent: '#f472b6' },
    { id: 'summer', label: 'Summer', emoji: '☀️', accent: '#fbbf24' },
    { id: 'storm', label: 'Storm', emoji: '⛈️', accent: '#818cf8' },
  ]

  const speeds = [
    { id: 'gentle', label: 'Gentle', factor: '0.6x' },
    { id: 'brisk', label: 'Brisk', factor: '1.0x' },
    { id: 'storm', label: 'Gale', factor: '2.0x' },
  ]

  const activeSeasonData = seasons.find((s) => s.id === currentSeason) || seasons[0]

  // Click outside to collapse dock
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) {
        setIsExpanded(false)
      }
    }
    if (isExpanded) {
      document.addEventListener('pointerdown', handleClickOutside)
    }
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [isExpanded])

  return (
    <aside
      ref={dockRef}
      aria-label="Atmospheric controls"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 font-sans"
    >
      {/* Expanded Control Glass Panel */}
      {isExpanded && (
        <div
          role="region"
          aria-label="Atmospheric settings"
          className="glass-card mb-2 sm:mb-3 p-3.5 sm:p-5 rounded-3xl w-[calc(100vw-1.5rem)] max-w-[310px] sm:w-80 shadow-2xl border border-white/15 animate-scale-in"
          style={{
            background: 'rgba(18, 14, 12, 0.95)',
            backdropFilter: 'blur(28px)',
            boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 30px ${activeSeasonData.accent}25`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: activeSeasonData.accent }} />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-white/90">
                Atmosphere Engine
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="mb-3">
            <button
              onClick={onToggleAutoSync}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${
                isAutoSync
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sync with City Weather</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {isAutoSync ? 'ON' : 'MANUAL'}
              </span>
            </button>
          </div>

          {/* Season Selector */}
          <div className="mb-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
              Season Theme
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {seasons.map((s) => {
                const isActive = currentSeason === s.id && !isAutoSync
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSeasonChange(s.id)
                    }}
                    className={`py-1.5 sm:py-2 px-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={
                      isActive
                        ? {
                            background: `linear-gradient(135deg, ${s.accent}30, ${s.accent}15)`,
                            border: `1px solid ${s.accent}60`,
                            boxShadow: `0 0 15px ${s.accent}25`,
                          }
                        : { border: '1px solid rgba(255,255,255,0.05)' }
                    }
                  >
                    <span className="text-sm">{s.emoji}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Wind Speed Control */}
          <div className="mb-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
              Wind Velocity
            </p>
            <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
              {speeds.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => onWindSpeedChange(sp.id)}
                  className={`flex-1 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-all ${
                    windSpeed === sp.id
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Updraft Gust Button */}
          <button
            onClick={() => onTriggerGust(1.6)}
            className="w-full py-2 sm:py-2.5 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-all transform active:scale-95 group shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${activeSeasonData.accent}, ${activeSeasonData.accent}cc)`,
              boxShadow: `0 4px 20px ${activeSeasonData.accent}40`,
              color: '#0d1117',
            }}
          >
            <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-45" />
            <span>Trigger Wind Gust</span>
          </button>
        </div>
      )}

      {/* Floating Collapsed Pill / Dock Bar */}
      <div
        className="glass-card flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full border border-white/15 shadow-xl transition-all"
        style={{
          background: 'rgba(18, 14, 12, 0.9)',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${activeSeasonData.accent}15`,
        }}
      >
        {/* Quick Gust Button */}
        <button
          onClick={() => onTriggerGust(1.5)}
          title="Release Wind Gust"
          className="p-1.5 sm:px-3 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all group"
        >
          <Wind className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:rotate-45" />
          <span className="hidden sm:inline text-[11px]">Gust</span>
        </button>

        {/* Current Active Theme Indicator & Expander */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all group"
          style={{
            background: `linear-gradient(135deg, ${activeSeasonData.accent}20, transparent)`,
            border: `1px solid ${activeSeasonData.accent}40`,
          }}
        >
          <span className="text-xs sm:text-sm">{activeSeasonData.emoji}</span>
          <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
            {isAutoSync ? 'Auto' : activeSeasonData.label}
          </span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeSeasonData.accent }} />
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/60" />
          ) : (
            <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/60" />
          )}
        </button>
      </div>
    </aside>
  )
}
