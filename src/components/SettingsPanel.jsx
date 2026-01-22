import { useState } from 'react'
import { Settings, X, Sun, Eye, Bell, Gauge, MapPin, Palette } from 'lucide-react'

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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'general'
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('display')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'display'
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Display
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'notifications'
                ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Alerts
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="px-6 py-4 space-y-6">
              {/* Temperature Unit */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <Gauge className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Temperature Unit</span>
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'metric', label: '°C (Celsius)', desc: 'Metric' },
                    { value: 'imperial', label: '°F (Fahrenheit)', desc: 'Imperial' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onUnitChange(option.value)}
                      className={`flex-1 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                        unit === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs opacity-75">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Default View */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Default View</span>
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'cards', label: 'Cards', desc: 'Dashboard' },
                    { value: 'map', label: 'Map', desc: 'Geographic' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onViewModeChange(option.value)}
                      className={`flex-1 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                        viewMode === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs opacity-75">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="px-6 py-4 space-y-6">
              {/* Theme */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Theme</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'auto', label: 'Auto', desc: '🌓' },
                    { value: 'light', label: 'Light', desc: '☀️' },
                    { value: 'dark', label: 'Dark', desc: '🌙' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onThemeChange(option.value)}
                      className={`px-3 py-3 rounded-lg transition text-sm font-medium flex flex-col items-center gap-1 ${
                        theme === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg">{option.desc}</span>
                      <span className="text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Display Options */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Display Options</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-300">Show wind details</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-300">Show humidity</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-300">Show pressure</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="px-6 py-4 space-y-6">
              {/* Alerts Banner */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium text-sm">Weather Alerts</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition">
                  <input
                    type="checkbox"
                    checked={showAlerts}
                    onChange={(e) => onAlertsChange(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">Enable Alert Banner</div>
                    <div className="text-xs text-gray-400">Show weather warnings and alerts</div>
                  </div>
                </label>
              </div>

              {/* Notification Types */}
              <div>
                <label className="text-white font-medium text-sm mb-3 block">
                  Alert Types
                </label>
                <div className="space-y-2">
                  {[
                    { name: 'severe', label: 'Severe Weather', desc: 'Storms, extreme heat/cold' },
                    { name: 'wind', label: 'High Winds', desc: 'Wind speeds over 40 km/h' },
                    { name: 'rain', label: 'Heavy Rain', desc: 'Rainfall alerts' },
                    { name: 'snow', label: 'Snow Warnings', desc: 'Snowfall and blizzards' },
                  ].map((alert) => (
                    <label
                      key={alert.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        disabled={!showAlerts}
                        className="w-4 h-4 rounded disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-300">{alert.label}</div>
                        <div className="text-xs text-gray-500">{alert.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 bg-black/20">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
