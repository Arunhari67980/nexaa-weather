# 🌦️ Weather Visualizer - Developer Guide

## Architecture Overview

### Component Hierarchy
```
App (Main Component)
├── Header (Unit Toggle & Alerts Button)
├── SearchBar
├── CurrentWeather (Current conditions display)
├── WeatherDetails (Sunrise, sunset, wind direction, etc.)
├── HourlyForecast (8-hour cards)
├── ForecastChart (5-day trends)
└── AlertsPanel (Weather warnings)
```

### Data Flow
```
SearchBar Input
    ↓
fetchWeatherData() → CurrentWeather, WeatherDetails, AlertsPanel
                   ↓
fetchForecastData() → HourlyForecast, ForecastChart
```

## Component Descriptions

### App.jsx
**Main application component**
- Manages global state (city, weather data, loading, errors)
- Handles API calls
- Controls unit conversion (metric/imperial)
- Routes data to child components

**Key State:**
- `city`: Current selected city
- `currentWeather`: Current weather object
- `forecastData`: 5-day forecast array
- `hourlyData`: Next 8 hours
- `unit`: Temperature unit (metric/imperial)
- `loading`: Loading state
- `error`: Error messages

### SearchBar.jsx
**City search interface**
- Text input with icon
- Suggestion dropdown
- Enter key support
- Click-to-search button

**Features:**
- Real-time suggestions (simulated)
- Input validation
- Clear on search

### CurrentWeather.jsx
**Main weather display card**
- City name and description
- Large temperature display
- "Feels like" temperature
- 6 stat cards (humidity, wind, pressure, visibility, cloud cover)

**Props:**
- `data`: Weather object from API
- `unit`: Temperature unit
- `city`: City name

### HourlyForecast.jsx
**Hourly forecast cards**
- Horizontal scrolling layout
- 8 cards showing next 8 hours
- Time, icon, temp, condition
- Humidity and wind stats

**Features:**
- Smooth scrollbar
- Hover animations
- Responsive layout

### ForecastChart.jsx
**Chart.js integration**
- Line chart: Temperature & Humidity
- Bar chart: Rainfall prediction
- 5-day forecast data
- Responsive charts

**Technologies:**
- Chart.js
- react-chartjs-2
- 5-day forecast API data

### WeatherDetails.jsx
**Extended weather metrics**
- 6-item grid layout
- Sunrise/Sunset times
- Wind direction
- Dew point
- Min/Max temperatures
- Lucide icons

**Uses:**
- Lucide React icons
- Time formatting
- Calculated values

### AlertsPanel.jsx
**Smart weather alerts**
- Automatic alert generation
- Severity levels (critical, warning, info)
- Icon indicators
- Styled alert boxes

**Alert Types:**
1. **Freezing** (< 0°C)
2. **Strong Wind** (> 10 m/s)
3. **High Humidity** (> 90%)
4. **Heavy Clouds** (> 80%)
5. **Low Visibility** (< 1km)
6. **Extreme Heat** (> 35°C)

## API Integration (weatherApi.js)

### fetchWeatherData(city, units)
**Gets current weather**
- Endpoint: `/weather`
- Returns: Current weather object
- Error handling: City not found, invalid key

### fetchForecastData(city, units)
**Gets 5-day forecast**
- Endpoint: `/forecast`
- Returns: 40 items (8 per day × 5 days)
- 3-hour intervals

### getWeatherIcon(code)
**Maps API codes to emojis**
- Uses weather condition codes
- Returns emoji for display
- Fallback to default icon

### Example Response Structure
```javascript
{
  main: {
    temp: 20,
    feels_like: 18,
    temp_min: 15,
    temp_max: 25,
    pressure: 1013,
    humidity: 65
  },
  weather: [{
    id: 500,
    main: "Rain",
    description: "light rain",
    icon: "10d"
  }],
  wind: {
    speed: 3.5,
    deg: 230
  },
  clouds: { all: 80 },
  visibility: 10000,
  sys: {
    sunrise: 1642000000,
    sunset: 1642040000
  }
}
```

## Styling Strategy

### CSS Variables (App.css)
```css
--primary-color: #1e3a8a
--secondary-color: #0f172a
--accent-color: #ff6b6b
--accent-teal: #4ecdc4
```

### Component Style Files
Each component has its own CSS file in `src/styles/`:
- Scoped to component class
- BEM naming convention
- Mobile-first responsive
- Hover effects and animations

### Design System
- **Colors**: Dark blue theme with red/teal accents
- **Typography**: Segoe UI, weighted hierarchy
- **Spacing**: 1rem base unit (16px)
- **Radius**: 15-20px for cards, 50px for pills
- **Shadows**: Multiple, layered for depth
- **Animations**: Smooth 0.3s transitions

## Responsive Design

### Breakpoints
- **Desktop**: >= 1024px (full layout)
- **Tablet**: 768px - 1023px (adjusted grid)
- **Mobile**: < 768px (single column, optimized)

### Mobile Optimizations
- Single column layouts
- Larger touch targets
- Reduced padding/margins
- Horizontal scrolling for charts
- Stacked components

## State Management

**Global State (App.jsx):**
- City selection
- Weather data cache
- Temperature unit
- UI states (loading, error, alerts)

**Local State (Component level):**
- SearchBar: Input value, suggestions
- AlertsPanel: No local state (computed)

**Future Enhancement:**
- Consider Context API for prop drilling
- Redux for larger apps

## Performance Optimization

### Current Optimizations
1. **Lazy loading**: Charts load with data
2. **Efficient re-renders**: useEffect dependencies
3. **No unnecessary state**: Computed values calculated on-render
4. **CSS animations**: GPU-accelerated transforms
5. **Event delegation**: Search suggestions

### Potential Improvements
- Memoization of expensive components
- Request debouncing for search
- Local storage caching
- Image lazy loading
- Code splitting with React.lazy()

## Environment Variables

**.env.local**
```
VITE_WEATHER_API_KEY=your_key_here
```

**Accessed via:**
```javascript
import.meta.env.VITE_WEATHER_API_KEY
```

## Error Handling

### API Errors
```javascript
- 404: City not found
- 401: Invalid API key
- Network: Generic error message
```

### User-Facing
- Error banner above content
- Clear messaging
- Actionable suggestions

## Browser DevTools Tips

### React DevTools
1. Install React DevTools extension
2. Inspect component hierarchy
3. Check state and props in real-time

### Network Tab
1. Monitor API calls to OpenWeatherMap
2. Check response times
3. Verify data structure

### Performance Tab
1. Check animation FPS
2. Profile component renders
3. Identify bottlenecks

## Common Customizations

### Change Color Scheme
Edit `App.css` CSS variables:
```css
:root {
  --primary-color: #new-color;
  --accent-color: #new-color;
}
```

### Add More Weather Metrics
1. Get data from API response
2. Add to `WeatherDetails.jsx`
3. Create new detail-item card
4. Style with existing CSS classes

### Modify Alert Conditions
Edit `AlertsPanel.jsx`:
```javascript
const generateAlerts = () => {
  // Add new conditions here
  if (weather.main.temp < -10) {
    alerts.push({
      type: 'severe-cold',
      message: '❄️ Severe cold warning',
      severity: 'critical'
    })
  }
}
```

### Change Default City
Edit `App.jsx`:
```javascript
const [city, setCity] = useState('New York')
```

## Testing Strategy

### Unit Tests (with Jest)
- Test weatherApi.js functions
- Mock API responses
- Test data transformations

### Integration Tests (with React Testing Library)
- Test component rendering
- Test user interactions
- Test data flow

### E2E Tests (with Cypress)
- Full user workflows
- Search → Display → Toggle Units

## Build & Deployment

### Production Build
```bash
npm run build
```
- Minified and optimized
- Tree-shaking removes unused code
- Output in `dist/` folder
- Ready for hosting

### Deployment Checklist
- [ ] Add API key to environment
- [ ] Test on production domain
- [ ] Verify all features work
- [ ] Check mobile responsiveness
- [ ] Monitor API usage
- [ ] Set up error tracking

## API Rate Limiting

**Free Tier Limits:**
- 1,000 calls/day
- 60 calls/minute

**Optimization Tips:**
- Cache data in session
- Minimize requests
- Don't search on every keystroke
- Debounce API calls

## Future Enhancement Ideas

1. **Local Storage**: Save favorite cities
2. **Geolocation**: Auto-detect user location
3. **Maps Integration**: Show weather on map
4. **PWA Features**: Offline support, installable
5. **Animations**: Weather condition animations
6. **Multi-language**: i18n support
7. **Dark/Light Theme**: User preference
8. **Notifications**: Push weather alerts
9. **Historical Data**: Compare past weather
10. **Radar Integration**: Show weather radar

## Debugging Tips

### Console Logging
```javascript
console.log('Weather data:', currentWeather)
console.log('Unit:', unit)
console.log('API Response:', response.data)
```

### React DevTools
- Inspect component tree
- Check props and state changes
- Monitor re-renders

### Network Inspection
- Check API requests
- Verify response structure
- Monitor data size

### Common Issues
1. **API Key not found**: Check `.env.local`
2. **CORS errors**: Use OpenWeatherMap proxy
3. **Charts not rendering**: Verify Chart.js installation
4. **Styling issues**: Check CSS file imports

---

**Happy coding! 🚀**

For more help, check:
- OpenWeatherMap API docs
- React documentation
- Vite guide
- Chart.js examples
