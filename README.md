# 🌦️ Advanced Weather Visualizer

A modern, feature-rich weather application built with React and Vite that provides real-time weather data, forecasts, and interactive visualizations.

## Features

### 🎯 Core Features
- **Real-time Weather Data**: Current weather conditions with detailed metrics
- **5-Day Forecast**: Visual charts showing temperature trends and precipitation
- **Hourly Forecast**: Hour-by-hour breakdown of upcoming weather
- **Interactive Charts**: Beautiful graphs powered by Chart.js
- **Weather Alerts**: Automatic alerts for extreme weather conditions
- **Unit Toggle**: Switch between Celsius and Fahrenheit
- **City Search**: Quick search with suggestions for any city worldwide

### 📊 Advanced Visualizations
- Temperature and humidity trend charts
- Rainfall prediction charts
- Real-time weather icons
- Responsive grid layout
- Smooth animations and transitions

### ⚠️ Smart Alerts
- Freezing temperature warnings
- Strong wind alerts
- High humidity notifications
- Low visibility warnings
- Extreme heat alerts
- Cloud cover information

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Get OpenWeatherMap API Key**
   - Visit [openweathermap.org/api](https://openweathermap.org/api)
   - Sign up for a free account
   - Create a `.env.local` file:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

3. **Start development server**
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- Vite
- Chart.js & react-chartjs-2
- Axios
- Lucide React
- CSS3

## License

MIT License

