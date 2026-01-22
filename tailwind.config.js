/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'weather-dark': '#0f172a',
        'weather-darker': '#0a0f1f',
        'weather-card': 'rgba(30, 41, 59, 0.8)',
        'weather-accent': '#3b82f6',
        'weather-cyan': '#06b6d4',
      },
      backgroundImage: {
        'gradient-weather': 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
}
