# NEXAA · Atmospheric Weather Intelligence

Cinematic, hardware-accelerated atmospheric intelligence dashboard delivering real-time meteorological telemetry, dynamic seasonal particle physics, and responsive meteorological forecasting.

---

## ✨ Features

- **Dynamic Atmospheric Engine**: Hardware-accelerated particle canvas supporting 5 seasonal modes:
  - 🌸 **Spring**: Gentle breeze with drifting cherry blossom (Sakura) petals
  - ☀️ **Summer**: Ambient warm dusk with floating fireflies
  - 🍂 **Autumn**: Golden maple leaves drifting with wind aerodynamics
  - ❄️ **Winter**: Crystalline snowflakes and northern aurora glows
  - ⛈️ **Storm**: High-velocity rain streaks with atmospheric lightning flash
- **Location-Driven Season Adaptation**: Defaults to Spring on initial site visit and dynamically adapts to the live meteorological conditions of any selected location.
- **Mobile 60/120Hz Optimization**:
  - Native momentum touch scrolling with smooth scroll offloading on touch screens
  - Lean mobile particle density (16 particles) with streamlined vector paths
  - Click shockwaves and aerodynamic drag touch listeners disabled on mobile to prevent touch jitter
  - Optimized GPU backdrop blurs and memory management
- **Telemetry & Visualizations**:
  - **Hero Telemetry Card**: Core atmospheric sensors, humidity, wind vectors, barometer, and visibility
  - **24-Hour Telemetry Carousel**: Hour-by-hour forecast with temperature curves and precipitation
  - **Thermal Trajectory**: Smooth interactive area chart powered by Recharts
  - **7-Day Synoptic Outlook**: High/low temperature ranges and condition outlook
  - **Air Purity Index (AQI)**: Multi-pollutant breakdown ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{O}_3$, $\text{CO}$, $\text{SO}_2$)
  - **Radar Map View**: Interactive satellite radar map mode
  - **Station Comparison**: Side-by-side meteorological comparison of two cities
  - **GPS Current Location**: One-tap geolocation detection via browser GPS

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) (Desktop fine-pointer optimized)
- **Data Source**: [OpenWeatherMap API](https://openweathermap.org/api)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm / pnpm / yarn

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   git clone https://github.com/your-username/nexaa-weather.git
   cd nexaa-weather
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   ```
   *(Get a free API key at [openweathermap.org/api](https://openweathermap.org/api))*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Architecture

```
nexaa-weather/
├── public/
│   └── favicon.svg              # Brand SVG favicon
├── src/
│   ├── api/
│   │   └── weatherApi.js        # OpenWeatherMap client & geocoding
│   ├── components/
│   │   ├── AirQualityIndex.jsx  # AQI & pollutant breakdown
│   │   ├── AlertsBanner.jsx     # Meteorological warning alerts
│   │   ├── AtmosphericEngine.jsx# Multi-season canvas particle engine
│   │   ├── ComparisonView.jsx   # Side-by-side city comparator modal
│   │   ├── CursorGlow.jsx       # Desktop cursor spotlight
│   │   ├── DetailedWeather.jsx  # Core atmospheric metrics grid
│   │   ├── EnhancedDetails.jsx  # Ephemeris (sun/moon) & outdoor recommendations
│   │   ├── HourlyForecastCarousel.jsx # 24-hour horizontal forecast snap track
│   │   ├── LoadingSkeleton.jsx  # Glassmorphic skeleton loader
│   │   ├── MapView.jsx          # Interactive radar & station map
│   │   ├── RecentSearches.jsx   # Starred stations & search history
│   │   ├── SearchBar.jsx        # Autocomplete search & GPS geolocation
│   │   ├── SettingsPanel.jsx    # User preferences (units, view modes, themes)
│   │   ├── TemperatureTrends.jsx# Thermal trajectory chart
│   │   ├── TiltCard.jsx         # 3D interactive hero card (desktop)
│   │   ├── WeatherDock.jsx      # Floating seasonal atmosphere controller
│   │   └── WeeklyForecast.jsx   # 7-day synoptic forecast
│   ├── utils/
│   │   ├── smoothScroll.js      # Lenis smooth scroll manager (desktop only)
│   │   └── weatherUtils.js      # Weather icon mappings, formatting, CSV export
│   ├── App.css                  # Glassmorphism & responsive GPU styles
│   ├── App.jsx                  # Main application orchestrator
│   ├── index.css                # Tailwind directives & seasonal themes
│   └── main.jsx                 # React root DOM entrypoint
├── index.html                   # HTML entrypoint with typography fonts
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Tailwind configuration
└── vite.config.js               # Vite build configuration
```

---

## 📄 License

MIT License © 2026 NEXAA Weather Intelligence.
