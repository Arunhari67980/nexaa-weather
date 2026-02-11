/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0f0c29',
        surface: 'rgba(255, 255, 255, 0.1)',
        'surface-highlight': 'rgba(255, 255, 255, 0.15)',
        primary: '#3b82f6', // blue-500
        secondary: '#8b5cf6', // violet-500
        accent: '#06b6d4', // cyan-500
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(to right bottom, #0f0c29, #302b63, #24243e)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(236, 72, 153, 0.3) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
