/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#030712',
        'bg-dark': '#0a0e27',
        'bg-darker': '#050811',
        'surface-light': 'rgba(255, 255, 255, 0.08)',
        'surface-lighter': 'rgba(255, 255, 255, 0.12)',
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #030712 0%, #1a1a3e 25%, #2a1a4e 50%, #1a1a3e 75%, #030712 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.25) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.25) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(236, 72, 153, 0.25) 0px, transparent 50%)',
        'gradient-aurora': 'linear-gradient(180deg, rgba(59, 130, 246, 0.15) 0%, transparent 50%, rgba(139, 92, 246, 0.1) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'drift': 'drift 12s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '1', transform: 'translateX(-100%)' },
          '50%': { opacity: '0.5', transform: 'translateX(100%)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(20px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'card-lg': '0 20px 60px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
