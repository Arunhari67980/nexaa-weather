# 🌦️ Weather Visualizer - FAQ & Troubleshooting

## Getting Started

### Q: How do I get started?
**A:** Follow these 3 simple steps:
1. `npm install` - Install dependencies
2. Create `.env.local` with your API key
3. `npm run dev` - Start the server
4. Open `http://localhost:5173`

### Q: Where do I get the API key?
**A:** 
1. Go to https://openweathermap.org/api
2. Create a free account
3. Go to API Keys section
4. Copy your API key
5. Paste into `.env.local`

### Q: Is the API key free?
**A:** Yes! The free tier includes:
- 1,000 API calls per day
- 60 calls per minute
- Current weather + 5-day forecast
- No credit card required initially

## Installation Issues

### Q: I get "npm: command not found"
**A:** Install Node.js from https://nodejs.org (includes npm)

### Q: Dependencies won't install
**A:** 
```bash
# Try clearing npm cache
npm cache clean --force

# Then reinstall
rm -rf node_modules package-lock.json
npm install
```

### Q: Port 5173 already in use
**A:**
```bash
# Use a different port
npm run dev -- --port 3000
```

### Q: "Module not found" errors
**A:**
```bash
# Reinstall all dependencies
npm install

# Or install specific packages
npm install axios chart.js react-chartjs-2 lucide-react
```

## API Key Issues

### Q: "Invalid API Key" error
**A:**
1. Verify API key is correct in `.env.local`
2. Check it's from OpenWeatherMap (not another service)
3. Make sure it's active on openweathermap.org
4. Give it 10 minutes to activate after creation

### Q: How do I reset my API key?
**A:**
1. Log into openweathermap.org
2. Go to API Keys section
3. Click the key to regenerate it
4. Update `.env.local`

### Q: How many API calls am I allowed?
**A:**
- Free tier: 1,000 calls/day
- Rate limit: 60 calls/minute
- Current app uses: ~1 call per search

## Search & City Issues

### Q: City not found error
**A:**
1. Check spelling (London not Lndon)
2. Try with country code: "London, UK"
3. Some small towns aren't available
4. Use main cities in your region

### Q: Can I search multiple cities?
**A:** Currently shows one city at a time. Future update can add comparison feature.

### Q: How can I save favorite cities?
**A:** Currently not implemented, but can be added using localStorage.

## Data & Display Issues

### Q: Why is the temperature wrong?
**A:**
1. Verify API key is working
2. Check you're in the right units (°C vs °F)
3. OpenWeatherMap data updates every 10 minutes
4. Weather stations may vary slightly

### Q: Charts not showing
**A:**
```bash
# Reinstall Chart.js
npm install chart.js react-chartjs-2

# Clear cache and reload browser
Ctrl+Shift+Del (then select All time)
```

### Q: Hourly forecast missing
**A:**
- Requires 5-day forecast data
- Some cities might not have hourly data
- Try searching again

### Q: Alerts not showing
**A:**
1. Click the ⚠️ button in header
2. Weather must meet alert conditions
3. Check the alert conditions in code

## Styling & Display

### Q: How do I change the colors?
**A:** Edit the CSS variables in `src/App.css`:
```css
:root {
  --primary-color: #1e3a8a;      /* Dark blue */
  --accent-color: #ff6b6b;       /* Red */
  --accent-teal: #4ecdc4;        /* Teal */
}
```

### Q: The app looks zoomed in on mobile
**A:**
1. Check viewport meta tag in `index.html`
2. Clear browser cache
3. Reload the page
4. Try incognito mode

### Q: Can I change to a light theme?
**A:** Currently dark theme only. Can be added as a toggle feature.

## Performance

### Q: Why is the app slow?
**A:**
1. Check internet connection
2. API might be slow (check openweathermap.org status)
3. Clear browser cache
4. Close other tabs
5. Try a different browser

### Q: How do I make it faster?
**A:**
1. App is already optimized
2. API calls are your bottleneck
3. Consider caching responses
4. Use a faster internet connection

## Deployment

### Q: How do I deploy this?
**A:**
```bash
# Build for production
npm run build

# Deploy options:
# 1. Vercel: vercel deploy
# 2. Netlify: Drag dist/ folder
# 3. GitHub Pages: Push to gh-pages branch
# 4. Traditional server: Upload dist/ via FTP
```

### Q: Do I need to change anything to deploy?
**A:**
1. ✅ Set API key in environment variables
2. ✅ Build with `npm run build`
3. ✅ Deploy the `dist/` folder
4. ✅ Test on production domain

### Q: Will it work offline?
**A:** Currently no. Need internet for weather data. Can add service workers for PWA.

## Customization

### Q: How do I add more weather metrics?
**A:**
1. Get data from API response in `weatherApi.js`
2. Add to `WeatherDetails.jsx` or create new component
3. Add CSS styling
4. Display the data

### Q: Can I add geolocation?
**A:** Yes, add this to App.jsx:
```javascript
useEffect(() => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords
    // Use reverse geocoding to get city name
  })
}, [])
```

### Q: How do I save favorite cities?
**A:** Use localStorage:
```javascript
const saveFavorite = (city) => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  favorites.push(city)
  localStorage.setItem('favorites', JSON.stringify(favorites))
}
```

### Q: Can I add more alerts?
**A:** Yes, edit `AlertsPanel.jsx`:
```javascript
if (weather.main.temp < -10) {
  alerts.push({
    type: 'severe-cold',
    message: '❄️ Severe cold warning',
    severity: 'critical'
  })
}
```

## Common Errors & Solutions

### Error: "Cannot read property 'main' of undefined"
**Solution:** API call hasn't completed yet. Check:
- API key is valid
- City name is correct
- Network request succeeded

### Error: "ReferenceError: Chart is not defined"
**Solution:** 
```bash
npm install chart.js react-chartjs-2
```

### Error: "VITE_WEATHER_API_KEY is undefined"
**Solution:** Create `.env.local`:
```
VITE_WEATHER_API_KEY=your_key_here
```

### Error: "Module federation error"
**Solution:**
```bash
npm cache clean --force
npm install
npm run dev
```

## Advanced Questions

### Q: Can I use a different weather API?
**A:** Yes, modify `src/api/weatherApi.js` to use:
- Weather.gov (US only)
- weather.com
- Open-Meteo (free, no key needed)
- AccuWeather

### Q: How do I add dark/light mode toggle?
**A:**
1. Add state for theme
2. Create CSS variables for both themes
3. Toggle with button
4. Save preference to localStorage

### Q: Can I create a mobile app?
**A:** Yes, use:
- React Native
- Expo
- Or wrap in Electron

### Q: How do I add language support?
**A:** Use i18next library:
```bash
npm install i18next react-i18next
```

### Q: Can I add weather notifications?
**A:** Yes, use Web Push API or service workers.

## Getting Help

### If you're stuck:
1. Check this FAQ first
2. Read the **DEVELOPER_GUIDE.md**
3. Check browser console for errors (F12)
4. Check OpenWeatherMap API status
5. Try the example at openweathermap.org

### Resources:
- **OpenWeatherMap Docs**: https://openweathermap.org/api
- **React Docs**: https://react.dev
- **Vite Docs**: https://vite.dev
- **Chart.js Docs**: https://www.chartjs.org
- **Axios Docs**: https://axios-http.com

### Debug Tips:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Use React DevTools extension
5. Log variables with console.log()

## Feature Requests

### Want to add a feature?
1. Check if it's already planned
2. Review the codebase
3. Implement following the patterns
4. Test thoroughly
5. Update documentation

### Popular feature ideas:
- [ ] Save favorite cities
- [ ] Weather maps
- [ ] Historical data
- [ ] Notifications
- [ ] Dark/Light theme
- [ ] Multi-language
- [ ] Comparison tool
- [ ] Weather radar
- [ ] Air quality data
- [ ] Pollen count

## Performance Tips

### Optimize your setup:
1. **Clear cache** before updates
2. **Use modern browser** (Chrome, Firefox)
3. **Check internet** (affects API calls)
4. **Close unused tabs** to free memory
5. **Disable extensions** that interfere

### Monitor usage:
```bash
# Check if you're hitting API limits
# Monitor in browser DevTools Network tab
# Watch for 429 errors (rate limit)
```

## Conclusion

If you can't find the answer:
1. Review the included documentation
2. Check error messages carefully
3. Search online for the error message
4. Inspect browser console for details
5. Try a fresh browser/incognito window

Most issues are:
- **API key** related (verify it's correct)
- **Dependencies** missing (run npm install)
- **Port** conflicts (use different port)
- **Cache** issues (clear and reload)

**Happy weather tracking! 🌦️**

---

Last Updated: January 2026
For more help, see SETUP_GUIDE.md, DEVELOPER_GUIDE.md, or FEATURES.md
