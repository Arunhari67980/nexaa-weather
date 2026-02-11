import { useState } from 'react'
import { Settings, X, Gauge, MapPin, Palette, Eye, Bell } from 'lucide-react'

export default function SettingsPanel({
  isOpen, onClose, unit, onUnitChange, showAlerts, onAlertsChange,
  viewMode, onViewModeChange, theme, onThemeChange,
}) {
  const [activeTab, setActiveTab] = useState('general')
  if (!isOpen) return null

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'display', label: 'Display' },
    { id: 'alerts', label: 'Alerts' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={handleBackdrop}>
      <div className="glass-card rounded-3xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col animate-scale-in"
        style={{ background: 'rgba(12,16,32,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 gap-1 pt-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors ${activeTab === t.id
                  ? 'text-blue-400'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
              style={activeTab === t.id ? { background: 'rgba(79,139,255,0.08)', borderBottom: '2px solid #4f8bff' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {activeTab === 'general' && (
            <>
              <SettingGroup icon={<Gauge className="w-4 h-4 text-blue-400" />} label="Temperature Unit">
                <div className="flex gap-2">
                  {[{ v: 'metric', l: '°C Celsius' }, { v: 'imperial', l: '°F Fahrenheit' }].map(o => (
                    <button key={o.v} onClick={() => onUnitChange(o.v)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${unit === o.v ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      style={unit === o.v
                        ? { background: 'rgba(79,139,255,0.2)', border: '1px solid rgba(79,139,255,0.3)' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                      }>
                      {o.l}
                    </button>
                  ))}
                </div>
              </SettingGroup>

              <SettingGroup icon={<MapPin className="w-4 h-4 text-blue-400" />} label="Default View">
                <div className="flex gap-2">
                  {[{ v: 'cards', l: '📊 Dashboard' }, { v: 'map', l: '🗺️ Map' }].map(o => (
                    <button key={o.v} onClick={() => onViewModeChange(o.v)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${viewMode === o.v ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      style={viewMode === o.v
                        ? { background: 'rgba(79,139,255,0.2)', border: '1px solid rgba(79,139,255,0.3)' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                      }>
                      {o.l}
                    </button>
                  ))}
                </div>
              </SettingGroup>
            </>
          )}

          {activeTab === 'display' && (
            <SettingGroup icon={<Palette className="w-4 h-4 text-blue-400" />} label="Theme">
              <div className="grid grid-cols-3 gap-2">
                {[{ v: 'auto', l: 'Auto', e: '🌓' }, { v: 'light', l: 'Light', e: '☀️' }, { v: 'dark', l: 'Dark', e: '🌙' }].map(o => (
                  <button key={o.v} onClick={() => onThemeChange(o.v)}
                    className={`py-4 rounded-xl text-sm font-semibold flex flex-col items-center gap-1.5 transition-all ${theme === o.v ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    style={theme === o.v
                      ? { background: 'rgba(79,139,255,0.2)', border: '1px solid rgba(79,139,255,0.3)' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                    }>
                    <span className="text-xl">{o.e}</span>
                    <span className="text-xs">{o.l}</span>
                  </button>
                ))}
              </div>
            </SettingGroup>
          )}

          {activeTab === 'alerts' && (
            <SettingGroup icon={<Bell className="w-4 h-4 text-blue-400" />} label="Weather Alerts">
              <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors"
                style={{ background: showAlerts ? 'rgba(79,139,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showAlerts ? 'rgba(79,139,255,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                <input type="checkbox" checked={showAlerts} onChange={(e) => onAlertsChange(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-white">Enable Alert Banner</p>
                  <p className="text-xs text-gray-500">Show weather warnings and alerts</p>
                </div>
              </label>
            </SettingGroup>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #4f8bff, #6366f1)', boxShadow: '0 4px 20px rgba(79,139,255,0.25)' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingGroup({ icon, label, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      {children}
    </div>
  )
}
