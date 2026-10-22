import { useState } from 'react'
import { Settings, X, Gauge, MapPin, Palette, Bell } from 'lucide-react'

export default function SettingsPanel({
  isOpen,
  onClose,
  unit,
  onUnitChange,
  showAlerts,
  onAlertsChange,
  viewMode,
  onViewModeChange,
  theme,
  onThemeChange,
}) {
  const [activeTab, setActiveTab] = useState('general')
  if (!isOpen) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'display', label: 'Display' },
    { id: 'alerts', label: 'Advisories' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={handleBackdrop}
    >
      <div
        className="glass-card rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in"
        style={{
          background: 'rgba(18, 14, 12, 0.95)',
          border: '1px solid var(--theme-glass-border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px var(--theme-glow)',
        }}
      >
        <div className="top-edge-flare" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" style={{ color: 'var(--theme-accent)' }} />
            <h2 className="text-base font-bold font-mono tracking-wider uppercase text-white">
              System Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 gap-2 pt-3 border-b border-white/5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all ${
                activeTab === t.id
                  ? 'text-white border-b-2'
                  : 'text-white/40 hover:text-white/70'
              }`}
              style={
                activeTab === t.id
                  ? {
                      borderColor: 'var(--theme-accent)',
                      background: 'rgba(255,255,255,0.05)',
                    }
                  : {}
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {activeTab === 'general' && (
            <>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Temperature Unit System</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: 'metric', l: 'Metric (°C · m/s)' },
                    { v: 'imperial', l: 'Imperial (°F · mph)' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onUnitChange(o.v)}
                      className={`py-3 px-3 rounded-2xl text-xs font-mono font-semibold transition-all ${
                        unit === o.v
                          ? 'text-white border'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        unit === o.v
                          ? {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'var(--theme-accent)',
                              boxShadow: '0 0 15px var(--theme-glow)',
                            }
                          : {}
                      }
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Interface Mode</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: 'cards', l: '📊 Dashboard' },
                    { v: 'map', l: '🗺️ Geospatial Radar' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onViewModeChange(o.v)}
                      className={`py-3 px-3 rounded-2xl text-xs font-mono font-semibold transition-all ${
                        viewMode === o.v
                          ? 'text-white border'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        viewMode === o.v
                          ? {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'var(--theme-accent)',
                              boxShadow: '0 0 15px var(--theme-glow)',
                            }
                          : {}
                      }
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'display' && (
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                <span>Interface Theme</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: 'auto', l: 'Adaptive', e: '🌓' },
                  { v: 'dark', l: 'Nocturnal', e: '🌙' },
                  { v: 'light', l: 'Aurora', e: '☀️' },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => onThemeChange(o.v)}
                    className={`py-3 px-2 rounded-2xl text-xs font-mono font-semibold flex flex-col items-center gap-1 transition-all ${
                      theme === o.v
                        ? 'text-white border'
                        : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                    }`}
                    style={
                      theme === o.v
                        ? {
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'var(--theme-accent)',
                            boxShadow: '0 0 15px var(--theme-glow)',
                          }
                        : {}
                    }
                  >
                    <span className="text-base">{o.e}</span>
                    <span>{o.l}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-mono font-bold text-white">Meteorological Advisories</p>
                  <p className="text-[11px] text-white/50">Show critical atmospheric alerts banner</p>
                </div>
              </div>
              <button
                onClick={() => onAlertsChange(!showAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  showAlerts ? 'bg-amber-500' : 'bg-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    showAlerts ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
