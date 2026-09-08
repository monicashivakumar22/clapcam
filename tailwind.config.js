/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#0a0a0f',
        surface: {
          DEFAULT: '#12121a',
          light: '#1a1a2e',
          lighter: '#242440',
        },
        accent: {
          cyan: '#00f0ff',
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#22c55e',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 240, 255, 0.15)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.15)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.15)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        glass: '16px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)' },
        },
        'glitch-1': {
          '0%, 100%': { clipPath: 'inset(0 0 0 0)' },
          '25%': { clipPath: 'inset(20% 0 60% 0)', transform: 'translate(-2px, 0)' },
          '50%': { clipPath: 'inset(50% 0 30% 0)', transform: 'translate(2px, 0)' },
          '75%': { clipPath: 'inset(10% 0 70% 0)', transform: 'translate(-1px, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch-1': 'glitch-1 0.3s ease-in-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
