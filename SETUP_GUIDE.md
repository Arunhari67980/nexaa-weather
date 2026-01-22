# 🌦️ Weather Visualizer - Quick Start Guide

## What You've Built

An **Advanced Weather Visualizer** web application with:
- ✅ Real-time weather data from OpenWeatherMap API
- ✅ Interactive 5-day forecast charts
- ✅ Hourly weather forecast cards
- ✅ Smart weather alerts system
- ✅ Temperature unit toggle (°C/°F)
- ✅ City search with suggestions
- ✅ Beautiful, fully responsive design
- ✅ Smooth animations and transitions

## Quick Start

### Step 1: Install Dependencies
```bash
cd weather
npm install
```

This will install:
- React 19
- Vite (build tool)
- Chart.js (data visualization)
- Axios (HTTP client)
- Lucide React (icons)

### Step 2: Get Your API Key (FREE)

1. Go to [openweathermap.org](https://openweathermap.org)
2. Click "Sign Up" and create a free account
3. Go to your API Keys section
4. Copy your API key

### Step 3: Configure Environment

Create a file named `.env.local` in the project root:

```
VITE_WEATHER_API_KEY=paste_your_api_key_here
```

**Don't have the file?** Copy `.env.example`:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and paste your API key.

### Step 4: Start the App

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## Features Guide

### 🔍 Search for Cities
- Type any city name
- Get instant suggestions
- View weather immediately

### 🌡️ Temperature Units
- Click **°C** or **°F** button in header
- Toggle between Celsius and Fahrenheit
- All data updates automatically

### ⚠️ Weather Alerts
- Click **⚠️** button to view alerts
- Shows warnings for:
  - Extreme temperatures
  - Strong winds
  - Low visibility
  - High humidity
  - And more!

### 📊 Data Visualizations
- **Current Weather**: Live conditions with temperature
- **Weather Stats**: Humidity, wind, pressure, visibility
- **Hourly Forecast**: Next 8 hours at a glance
- **5-Day Forecast**: Temperature trends and rainfall
- **Charts**: Interactive graphs showing trends

## Project Structure

```
src/
├── components/          # React components
│   ├── SearchBar       # City search
│   ├── CurrentWeather  # Current conditions
│   ├── ForecastChart   # Charts
│   ├── HourlyForecast  # Hourly data
│   ├── WeatherDetails  # Extra metrics
│   └── AlertsPanel     # Alerts
├── api/
│   └── weatherApi.js   # API calls
├── styles/             # Component styles
├── App.jsx            # Main app
├── App.css            # Global styles
└── main.jsx           # Entry point
```

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Troubleshooting

### "Invalid API Key" Error
✅ **Solution**: 
- Check your `.env.local` file has the correct key
- Make sure it's from OpenWeatherMap
- Verify the key is active on their website

### "City Not Found"
✅ **Solution**:
- Check spelling
- Try with country code: "London, UK"
- Some small towns aren't available

### Charts Not Showing
✅ **Solution**:
- Run `npm install chart.js react-chartjs-2`
- Clear browser cache (Ctrl+Shift+Del)
- Reload the page

### Port 5173 Already in Use
✅ **Solution**:
```bash
# Kill the process or use a different port
npm run dev -- --port 3000
```

## Customization Ideas

1. **Add more weather metrics**: Modify `WeatherDetails.jsx`
2. **Change colors**: Edit the CSS variables in `App.css`
3. **Add geolocation**: Use browser's Geolocation API
4. **Save favorites**: Use localStorage for saved cities
5. **Add maps**: Integrate Leaflet or Mapbox
6. **More alerts**: Expand `AlertsPanel.jsx` logic

## Performance Tips

- App automatically caches data during session
- Charts render efficiently
- Images are optimized
- Responsive design works on all devices
- Smooth animations without performance lag

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm run build
# Upload dist/ folder to Vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

### Deploy to GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

## Next Steps

1. ✅ Get your API key
2. ✅ Create `.env.local`
3. ✅ Run `npm install`
4. ✅ Run `npm run dev`
5. ✅ Search for a city
6. ✅ Explore all features!

## API Information

**OpenWeatherMap Free Tier Includes:**
- Current weather data
- 5-day forecast
- 1,000 requests/day
- 60 requests/minute

**Data Updated**: Every 10 minutes

## Support Resources

- [OpenWeatherMap Docs](https://openweathermap.org/api)
- [React Docs](https://react.dev)
- [Vite Docs](https://vite.dev)
- [Chart.js Docs](https://www.chartjs.org)

---

**Enjoy your advanced weather visualizer! 🌤️⛅🌧️**

Made with React + Vite + ❤️
