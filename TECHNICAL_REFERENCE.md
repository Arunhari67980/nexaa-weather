# Weather App - Technical Reference

## Complete API Documentation

### OpenWeatherMap Integration

#### Weather Data Response Schema
```javascript
{
  // Location
  coord: { lat: number, lon: number },
  name: string,
  
  // Weather conditions
  weather: [{
    id: number,           // Weather ID (200-954)
    main: string,         // Main condition (Clear, Clouds, Rain, etc.)
    description: string,  // Detailed description
    icon: string          // Icon ID (01d, 02n, etc.)
  }],
  
  // Temperature & pressure
  main: {
    temp: number,         // Current temperature
    feels_like: number,   // Perceived temperature
    temp_min: number,     // Daily minimum
    temp_max: number,     // Daily maximum
    pressure: number,     // Atmospheric pressure (hPa)
    humidity: number,     // Humidity (0-100%)
    grnd_level?: number,  // Ground-level pressure
    sea_level?: number    // Sea-level pressure
  },
  
  // Wind data
  wind: {
    speed: number,        // Wind speed (m/s or mph)
    deg: number,          // Wind direction (0-360°)
    gust?: number         // Wind gust speed
  },
  
  // Cloud & visibility
  clouds: { all: number },      // Cloud coverage (0-100%)
  visibility: number,            // Visibility (meters)
  
  // Precipitation
  rain?: { 1h?: number },        // Rainfall last 1h (mm)
  snow?: { 1h?: number },        // Snowfall last 1h (mm)
  
  // Other
  dt: number,                    // Unix timestamp
  sys: {
    sunrise: number,      // Sunrise time (Unix)
    sunset: number,       // Sunset time (Unix)
    country: string       // Country code
  },
  timezone: number               // Timezone offset (seconds)
}
```

#### Forecast Response Schema
```javascript
{
  list: [
    // 40 items (5 days × 8 entries/day)
    {
      dt: number,
      dt_txt: "2024-01-20 12:00:00",  // Human-readable time
      main: { /* same as weather */ },
      weather: [ /* same as weather */ ],
      wind: { /* same as weather */ },
      clouds: { all: number },
      visibility: number,
      pop: number,                    // Probability of precipitation (0-1)
      rain?: { 3h?: number },         // Expected rainfall (mm)
      snow?: { 3h?: number },         // Expected snowfall (mm)
      sys: { pod: string }            // Part of day (d=day, n=night)
    }
  ],
  city: {
    name: string,
    country: string,
    coord: { lat, lon },
    timezone: number
  }
}
```

#### Air Quality Response Schema
```javascript
{
  list: [
    {
      dt: number,
      main: {
        aqi: number  // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
      },
      components: {
        pm2_5: number,      // Fine particulate matter (µg/m³)
        pm10: number,       // Coarse particulate matter (µg/m³)
        no2: number,        // Nitrogen dioxide (µg/m³)
        no: number,         // Nitrogen monoxide (µg/m³)
        nox: number,        // Nitrogen oxides (µg/m³)
        nh3: number,        // Ammonia (µg/m³)
        o3: number,         // Ozone (µg/m³)
        so2: number,        // Sulfur dioxide (µg/m³)
        co: number          // Carbon monoxide (µg/m³)
      }
    }
  ]
}
```

#### City Search Response Schema
```javascript
[
  {
    name: string,           // City name
    lat: number,           // Latitude
    lon: number,           // Longitude
    country: string,       // ISO 3166 country code
    state?: string         // State/region (if applicable)
  }
  // ... more results
]
```

---

## Implementation Details

### Unit Conversion Functions
```javascript
// Temperature
celsius_to_fahrenheit = (c) => (c * 9/5) + 32
fahrenheit_to_celsius = (f) => (f - 32) * 5/9

// Wind Speed
ms_to_mph = (ms) => ms * 2.237
mph_to_ms = (mph) => mph / 2.237
kmh_to_ms = (kmh) => kmh / 3.6
ms_to_kmh = (ms) => ms * 3.6

// Pressure (already in hPa from API, mostly)
hpa_to_inHg = (hpa) => hpa * 0.02953

// Visibility
meters_to_miles = (m) => m / 1609.34
```

### Weather Icon Mapping
```javascript
// OpenWeatherMap Icon IDs
{
  '01d': '☀️',   // Clear sky day
  '01n': '🌙',   // Clear sky night
  '02d': '⛅',   // Few clouds day
  '02n': '🌙',   // Few clouds night
  '03d': '☁️',   // Scattered clouds day
  '03n': '☁️',   // Scattered clouds night
  '04d': '☁️',   // Broken clouds
  '04n': '☁️',
  '09d': '🌧️',   // Shower rain
  '09n': '🌧️',
  '10d': '🌧️',   // Rain
  '10n': '🌧️',
  '11d': '⛈️',   // Thunderstorm
  '11n': '⛈️',
  '13d': '❄️',   // Snow
  '13n': '❄️',
  '50d': '🌫️',   // Mist
  '50n': '🌫️'
}
```

### Wind Direction Conversion
```javascript
// Degrees to Cardinal Direction
const directions = [
  'N',   // 0-11.25
  'NNE', // 11.25-33.75
  'NE',  // 33.75-56.25
  'ENE', // 56.25-78.75
  'E',   // 78.75-101.25
  'ESE', // 101.25-123.75
  'SE',  // 123.75-146.25
  'SSE', // 146.25-168.75
  'S',   // 168.75-191.25
  'SSW', // 191.25-213.75
  'SW',  // 213.75-236.25
  'WSW', // 236.25-258.75
  'W',   // 258.75-281.25
  'WNW', // 281.25-303.75
  'NW',  // 303.75-326.25
  'NNW'  // 326.25-348.75
]

// Emoji mapping
const windEmojis = {
  0: '↑',    // N
  45: '↗',   // NE
  90: '→',   // E
  135: '↘',  // SE
  180: '↓',  // S
  225: '↙',  // SW
  270: '←',  // W
  315: '↖'   // NW
}
```

### Sunrise/Sunset Calculation
```javascript
// Unix timestamp conversion
const sunrise = new Date(weatherData.sys.sunrise * 1000)
const sunset = new Date(weatherData.sys.sunset * 1000)

// Format HH:MM
const sunriseTime = sunrise.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
})
```

### Temperature Trend Analysis
```javascript
// Determine trend from forecast
const analyzeTrend = (forecast) => {
  const first = forecast[0].main.temp
  const last = forecast[forecast.length - 1].main.temp
  
  if (last > first + 2) return 'rising'
  if (last < first - 2) return 'falling'
  return 'stable'
}
```

---

## Animation Specifications

### Timing Functions
```css
/* Standard cubic-bezier for all animations */
cubic-bezier(0.16, 1, 0.3, 1)

/* Explanation:
   - Fast start (0.16)
   - Overshoot peak (1.0)
   - Slight deceleration (0.3)
   - Smooth end (1.0)
   This creates a natural, springy feel
*/
```

### Animation Durations
```css
.animate-slide-down    { animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) }
.animate-scale-in      { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) }
.animate-slide-up      { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) }
.animate-fade-in       { animation: fadeIn 0.4s ease-in-out }
.animate-spin-slow     { animation: rotate 2s linear infinite }
.animate-pulse         { animation: pulse 2s ease-in-out infinite }
```

### Animation Delays
```javascript
// Staggered reveal pattern
style={{ animationDelay: `${index * 0.1}s` }}
// Creates: 0s, 0.1s, 0.2s, 0.3s, etc.
```

---

## Performance Metrics

### Current Build Statistics
```
Vite v7.3.1 Production Build
================================
✓ 1530 JavaScript modules
✓ 1 HTML file
✓ 1 CSS file

Output Sizes:
- index.html:        0.45 kB
- CSS:               40.53 kB (gzipped: 7.43 kB)
- JavaScript:        267.49 kB (gzipped: 84.85 kB)
- Total:             ~92 kB gzipped

Build Time: 1.80 seconds
```

### Performance Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3s
- **Lighthouse Score**: 85+

### Optimization Techniques Applied
1. **Code Splitting**: Vite automatically splits chunks
2. **CSS Purging**: Tailwind removes unused classes
3. **Image Optimization**: Unicode emojis (no file transfers)
4. **Tree Shaking**: Unused exports removed
5. **Minification**: HTML, CSS, JS minified
6. **Compression**: gzip enabled on server

---

## Data Caching Strategy

### API Response Caching
```javascript
// Current implementation: No explicit caching
// Each search makes fresh API call

// Recommended improvement:
const cache = new Map()
const CACHE_DURATION = 10 * 60 * 1000  // 10 minutes

const getCachedWeather = (city) => {
  const cached = cache.get(city)
  if (cached && Date.now() - cached.time < CACHE_DURATION) {
    return cached.data
  }
  return null
}
```

### localStorage Persistence
```javascript
// Strategy: Save to localStorage on state change
useEffect(() => {
  localStorage.setItem('temperatureUnit', unit)
}, [unit])

// Load from localStorage on mount
const [unit, setUnit] = useState(() => 
  localStorage.getItem('temperatureUnit') || 'metric'
)

// Storage Quota: ~5-10MB per domain
// Current Usage: < 1KB (mostly favorites & history)
```

---

## Security Considerations

### API Key Management
```javascript
// ✓ Correct: Use environment variable
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// ✗ Wrong: Hardcode in source
const API_KEY = 'abc123...'  // Exposed in git history
```

### XSS Prevention
```javascript
// ✓ React automatically escapes content
<div>{userInput}</div>  // Safe

// ✗ Avoid innerHTML
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

### CORS Handling
```javascript
// OpenWeatherMap API allows CORS
// No proxy needed for free tier
fetch(`https://api.openweathermap.org/data/2.5/weather?...`)
```

### Error Message Sanitization
```javascript
// ✓ Generic error messages to users
catch (err) {
  setError('Failed to load weather data')
}

// Log detailed errors server-side for debugging
console.error('API Error:', err)
```

---

## Browser API Integration

### Geolocation API
```javascript
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      (error) => {
        reject(new Error(error.message))
      }
    )
  })
}

// Usage
const { lat, lon } = await getUserLocation()
const weather = await fetchWeatherData(lat, lon)
```

### Navigator Share API
```javascript
const shareWeather = async (city, temp, condition) => {
  try {
    // Modern browsers support share
    await navigator.share({
      title: `Weather in ${city}`,
      text: `Current: ${temp}°C, ${condition}`,
      url: window.location.href
    })
  } catch (err) {
    // Fallback: Copy to clipboard
    const text = `Weather in ${city}: ${temp}°C, ${condition}`
    navigator.clipboard.writeText(text)
  }
}
```

### Clipboard API
```javascript
// Copy weather data
const copied = await navigator.clipboard.writeText(text)

// Catch permission denied
.catch(err => {
  console.log('Clipboard access denied')
})
```

### localStorage API
```javascript
// Save
localStorage.setItem('key', JSON.stringify(value))

// Retrieve
const value = JSON.parse(localStorage.getItem('key'))

// Remove
localStorage.removeItem('key')

// Check quota
if (navigator.storage && navigator.storage.estimate) {
  const estimate = await navigator.storage.estimate()
  const percentUsed = (estimate.usage / estimate.quota) * 100
}
```

---

## Responsive Design Breakpoints

### Tailwind CSS Breakpoints
```css
/* sm: 640px */
@media (min-width: 640px) { ... }

/* md: 768px */
@media (min-width: 768px) { ... }

/* lg: 1024px */
@media (min-width: 1024px) { ... }

/* xl: 1280px */
@media (min-width: 1280px) { ... }

/* 2xl: 1536px */
@media (min-width: 1536px) { ... }
```

### Grid Layouts
```javascript
// Mobile: 1 column
<div className="grid grid-cols-1 ...">

// Tablet: 2 columns
<div className="grid grid-cols-1 md:grid-cols-2 ...">

// Desktop: 3 columns
<div className="grid grid-cols-1 lg:grid-cols-3 ...">

// Gap spacing
<div className="gap-4 lg:gap-6 ...">
```

---

## Testing Strategy

### Unit Testing (Recommended)
```javascript
// Test utilities
describe('getActivitySuggestions', () => {
  test('returns running for sunny weather', () => {
    const weather = [{main: 'Clear', description: 'clear'}]
    const activities = getActivitySuggestions(weather, 25)
    expect(activities).toContain('🏃 Go for a run')
  })
})
```

### Integration Testing
```javascript
// Test components with props
test('CurrentWeatherCard renders temperature', () => {
  const weather = {
    main: {temp: 20, feels_like: 18},
    weather: [{main: 'Clear', icon: '01d'}],
    wind: {speed: 5, deg: 90}
  }
  render(<CurrentWeatherCard data={weather} unit="metric" city="London" />)
  expect(screen.getByText(/20°C/)).toBeInTheDocument()
})
```

### E2E Testing (Cypress/Playwright)
```javascript
describe('Weather Search', () => {
  it('searches for city and displays weather', () => {
    cy.visit('http://localhost:5174')
    cy.get('input[placeholder*="search"]').type('Paris')
    cy.get('button').contains('Search').click()
    cy.get('h2').contains('Paris').should('be.visible')
  })
})
```

---

## Debugging Tools

### React Developer Tools
- Chrome extension for component inspection
- Props/state debugging
- Component tree visualization
- Performance profiling

### Vue/React DevTools Console
```javascript
// Access React internals
$r.setState({unit: 'imperial'})
$r.props
```

### Network Debugging
```javascript
// Monitor API calls in DevTools Network tab
// Filter: fetch/XHR
// Check: status, response, headers
```

### localStorage Debugging
```javascript
// In console
localStorage.getItem('temperatureUnit')
JSON.parse(localStorage.getItem('favoriteSearches'))
localStorage.clear()  // ⚠️ Use with caution
```

---

## Deployment Configuration

### Vite Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false  // Try next port if busy
  },
  build: {
    outDir: 'dist',
    sourcemap: false,  // Production: no sourcemaps
    minify: 'terser'   // Minification
  }
})
```

### Environment Variables
```bash
# .env.local (never commit)
VITE_OPENWEATHER_API_KEY=your_key_here

# Accessed in code
import.meta.env.VITE_OPENWEATHER_API_KEY
```

---

## Troubleshooting Guide

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### API Key Issues
```javascript
// Check if key is loaded
console.log(import.meta.env.VITE_OPENWEATHER_API_KEY)

// Test API directly
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"
```

### localStorage Issues
```javascript
// Check quota
navigator.storage.estimate().then(estimate => {
  console.log('Usage:', estimate.usage, 'Quota:', estimate.quota)
})

// Clear if quota exceeded
localStorage.clear()
```

### Performance Issues
```javascript
// Identify slow components
console.time('componentName')
// ... code ...
console.timeEnd('componentName')

// Check bundle size
npm install -g vite-plugin-visualizer
```

---

## Code Snippets Library

### Debounce Hook
```javascript
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

### Async Data Fetching
```javascript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await fetchWeatherData(city, unit)
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [city, unit])
```

### Responsive Image Background
```css
background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                  url('bg.jpg');
background-size: cover;
background-position: center;
```

---

## Resources & References

### Official Documentation
- [React 19 Docs](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Vite User Guide](https://vitejs.dev/guide/)
- [OpenWeatherMap API](https://openweathermap.org/api)

### Learning Resources
- [MDN Web Docs](https://developer.mozilla.org)
- [CSS Tricks](https://css-tricks.com)
- [JavaScript.info](https://javascript.info)

### Tools
- VS Code with extensions
- Chrome DevTools
- React Developer Tools
- Lighthouse (Performance audit)

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production Ready ✅
