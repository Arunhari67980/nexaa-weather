import { useState } from 'react'
import {
  Settings,
  X,
  Gauge,
  MapPin,
  Palette,
  Bell,
  Eye,
  Wind,
  Droplets,
  Compass,
  Sparkles,
  Activity,
  Layers,
  Clock,
} from 'lucide-react'

export default function SettingsPanel({
  isOpen,
  onClose,
  unit,
  onUnitChange,
  windUnit = 'm/s',
  onWindUnitChange,
  pressureUnit = 'mb',
  onPressureUnitChange,
  showAlerts,
  onAlertsChange,
  alertSettings = { freeze: true, wind: true, rain: true, heat: true, visibility: true },
  onAlertSettingsChange,
  viewMode,
  onViewModeChange,
  theme,
  onThemeChange,
  displayOptions = {
    showWind: true,
    showHumidity: true,
    showPressure: true,
    showVisibility: true,
    showAqi: true,
    showHourly: true,
    showWeekly: true,
    showTrends: true,
    showEnhanced: true,
    animationIntensity: 'full',
  },
  onDisplayOptionsChange,
  autoRefreshInterval = 'off',
  onAutoRefreshChange,
}) {
  const [activeTab, setActiveTab] = useState('general') // 'general' | 'display' | 'alerts'

  if (!isOpen) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <Gauge className="w-3.5 h-3.5" /> },
    { id: 'display', label: 'Display & UI', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'alerts', label: 'Advisories', icon: <Bell className="w-3.5 h-3.5" /> },
  ]

  const updateDisplayOption = (key, value) => {
    if (onDisplayOptionsChange) {
      onDisplayOptionsChange({
        ...displayOptions,
        [key]: value,
      })
    }
  }

  const updateAlertSetting = (key, value) => {
    if (onAlertSettingsChange) {
      onAlertSettingsChange({
        ...alertSettings,
        [key]: value,
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans"
      onClick={handleBackdrop}
    >
      <div
        className="glass-card rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in"
        style={{
          background: 'rgba(18, 14, 12, 0.96)',
          border: '1px solid var(--theme-glass-border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px var(--theme-glow)',
        }}
      >
        <div className="top-edge-flare" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded-xl"
              style={{ background: 'var(--theme-accent)25', color: 'var(--theme-accent)' }}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-mono tracking-wider uppercase text-white">
                Telemetry Settings
              </h2>
              <p className="text-[10px] font-mono text-white/40">Customization & Instrumentation Preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex px-5 sm:px-6 gap-2 pt-3 border-b border-white/5 shrink-0 bg-white/2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all ${
                activeTab === t.id
                  ? 'text-white border-b-2'
                  : 'text-white/40 hover:text-white/70'
              }`}
              style={
                activeTab === t.id
                  ? {
                      borderColor: 'var(--theme-accent)',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--theme-accent)',
                    }
                  : {}
              }
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 scrollbar-thin">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <>
              {/* Temperature Unit */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Temperature Unit</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: 'metric', l: '°C (Celsius)', desc: 'Standard Metric' },
                    { v: 'imperial', l: '°F (Fahrenheit)', desc: 'Imperial Scale' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onUnitChange(o.v)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-mono font-semibold transition-all text-left ${
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
                      <div className="font-bold">{o.l}</div>
                      <div className="text-[10px] opacity-60 font-normal">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wind Speed Unit */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Wind Velocity Unit</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'm/s', l: 'm/s', desc: 'Meters / Sec' },
                    { v: 'km/h', l: 'km/h', desc: 'Kilometers / H' },
                    { v: 'mph', l: 'mph', desc: 'Miles / Hour' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onWindUnitChange && onWindUnitChange(o.v)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono font-semibold text-center transition-all ${
                        windUnit === o.v
                          ? 'text-white border'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        windUnit === o.v
                          ? {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'var(--theme-accent)',
                            }
                          : {}
                      }
                    >
                      <div className="font-bold">{o.l}</div>
                      <div className="text-[9px] opacity-60 font-normal">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Barometric Pressure Unit */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Barometric Pressure Unit</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'mb', l: 'hPa / mb', desc: 'Hectopascal' },
                    { v: 'inHg', l: 'inHg', desc: 'Inches Hg' },
                    { v: 'mmHg', l: 'mmHg', desc: 'Millimeters Hg' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onPressureUnitChange && onPressureUnitChange(o.v)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono font-semibold text-center transition-all ${
                        pressureUnit === o.v
                          ? 'text-white border'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        pressureUnit === o.v
                          ? {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'var(--theme-accent)',
                            }
                          : {}
                      }
                    >
                      <div className="font-bold">{o.l}</div>
                      <div className="text-[9px] opacity-60 font-normal">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interface Mode */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Primary Display Interface</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: 'cards', l: '📊 Dashboard Scope', desc: 'Tactical Widgets' },
                    { v: 'map', l: '🗺️ Geospatial Radar', desc: 'Orbital Coordinates' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onViewModeChange(o.v)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-mono font-semibold text-left transition-all ${
                        viewMode === o.v
                          ? 'text-white border'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        viewMode === o.v
                          ? {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'var(--theme-accent)',
                            }
                          : {}
                      }
                    >
                      <div className="font-bold">{o.l}</div>
                      <div className="text-[10px] opacity-60 font-normal">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Refresh */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Telemetry Auto-Synchronize</span>
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { v: 'off', l: 'Manual' },
                    { v: '5m', l: '5 Min' },
                    { v: '15m', l: '15 Min' },
                    { v: '30m', l: '30 Min' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onAutoRefreshChange && onAutoRefreshChange(o.v)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-mono font-semibold text-center transition-all ${
                        autoRefreshInterval === o.v
                          ? 'text-white border bg-white/15'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        autoRefreshInterval === o.v ? { borderColor: 'var(--theme-accent)' } : {}
                      }
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* DISPLAY & UI TAB */}
          {activeTab === 'display' && (
            <>
              {/* Theme Selection */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Visual Theme Profile</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'auto', l: 'Adaptive', e: '🌓', desc: 'Syncs with time' },
                    { v: 'dark', l: 'Nocturnal', e: '🌙', desc: 'Deep Obsidian' },
                    { v: 'light', l: 'Solar', e: '☀️', desc: 'Radiant Glow' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onThemeChange(o.v)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-mono font-semibold flex flex-col items-center gap-1 transition-all ${
                        theme === o.v
                          ? 'text-white border'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        theme === o.v
                          ? {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderColor: 'var(--theme-accent)',
                            }
                          : {}
                      }
                    >
                      <span className="text-base">{o.e}</span>
                      <span className="font-bold">{o.l}</span>
                      <span className="text-[9px] opacity-60 font-normal">{o.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Atmosphere Canvas Density */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Atmospheric Particle Canvas</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'full', l: 'Full Dynamic', desc: 'Full particles' },
                    { v: 'minimal', l: 'Minimal', desc: 'Low CPU' },
                    { v: 'off', l: 'Static', desc: 'Canvas off' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => updateDisplayOption('animationIntensity', o.v)}
                      className={`py-2 px-2 rounded-xl text-xs font-mono font-semibold text-center transition-all ${
                        displayOptions.animationIntensity === o.v
                          ? 'text-white border bg-white/15'
                          : 'text-white/50 bg-white/5 border border-white/5 hover:bg-white/10'
                      }`}
                      style={
                        displayOptions.animationIntensity === o.v
                          ? { borderColor: 'var(--theme-accent)' }
                          : {}
                      }
                    >
                      <div className="font-bold">{o.l}</div>
                      <div className="text-[9px] opacity-60 font-normal">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dashboard Element Visibility Toggles */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                  <span>Visible Widget Layers</span>
                </p>
                <div className="space-y-1.5">
                  {[
                    { k: 'showHourly', label: '24-Hour Telemetry Carousel', desc: 'Hour-by-hour forecast cards' },
                    { k: 'showTrends', label: 'Thermal & Rainfall Trajectory Chart', desc: 'Multi-metric area curves' },
                    { k: 'showWeekly', label: '7-Day Synoptic Outlook', desc: 'Weekly temperature forecast range' },
                    { k: 'showEnhanced', label: 'Solar Ephemeris & Activity Advice', desc: 'Sunrise, sunset, outfit guide' },
                    { k: 'showAqi', label: 'Air Purity Index (AQI)', desc: 'Pollutant particle concentrations' },
                    { k: 'showWind', label: 'Wind Vector & Direction Card', desc: 'Speed and angle compass' },
                    { k: 'showHumidity', label: 'Humidity & Moisture Sensor', desc: 'Relative atmospheric moisture' },
                    { k: 'showPressure', label: 'Barometric Atmospheric Pressure', desc: 'Surface atmospheric pressure' },
                  ].map((item) => (
                    <label
                      key={item.k}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="text-xs font-mono font-bold text-white">{item.label}</p>
                        <p className="text-[10px] text-white/40 font-mono">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={displayOptions[item.k] ?? true}
                        onChange={(e) => updateDisplayOption(item.k, e.target.checked)}
                        className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ADVISORIES & ALERTS TAB */}
          {activeTab === 'alerts' && (
            <>
              {/* Master Alerts Banner Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs font-mono font-bold text-white">Meteorological Advisory Banner</p>
                    <p className="text-[10px] text-white/50">Display top banner for extreme weather conditions</p>
                  </div>
                </div>
                <button
                  onClick={() => onAlertsChange(!showAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showAlerts ? 'bg-amber-500' : 'bg-white/15'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      showAlerts ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Granular Alert Types */}
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                  Active Advisory Triggers
                </p>
                <div className="space-y-2">
                  {[
                    {
                      k: 'freeze',
                      label: '❄️ Sub-Zero Freeze & Frost Warnings',
                      desc: 'Triggered when ambient temperature falls below 0°C',
                    },
                    {
                      k: 'wind',
                      label: '💨 High Velocity Gale & Strong Wind Alerts',
                      desc: 'Triggered when wind gusts exceed 10 m/s (36 km/h)',
                    },
                    {
                      k: 'rain',
                      label: '🌧️ Heavy Precipitation & Rain Warnings',
                      desc: 'Triggered during heavy rainfall and thunderstorms',
                    },
                    {
                      k: 'visibility',
                      label: '🌫️ Low Visibility & Dense Fog Alerts',
                      desc: 'Triggered when optical visibility drops under 1,000 meters',
                    },
                    {
                      k: 'heat',
                      label: '🔥 Extreme Heatwave Advisories',
                      desc: 'Triggered when temperatures exceed 35°C (95°F)',
                    },
                  ].map((alert) => (
                    <label
                      key={alert.k}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        showAlerts
                          ? 'bg-white/5 border-white/5 hover:bg-white/8 cursor-pointer'
                          : 'bg-white/2 border-white/2 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="pr-3">
                        <p className="text-xs font-mono font-bold text-white">{alert.label}</p>
                        <p className="text-[10px] text-white/40 font-mono mt-0.5">{alert.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        disabled={!showAlerts}
                        checked={alertSettings[alert.k] ?? true}
                        onChange={(e) => updateAlertSetting(alert.k, e.target.checked)}
                        className="w-4 h-4 rounded accent-amber-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-white/10 px-6 py-3.5 bg-black/40 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-white/40">Preferences saved locally</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:brightness-110 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-secondary))',
            }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  )
}
