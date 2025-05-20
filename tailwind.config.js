/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00FFFF',
        'neon-pink': '#FF00FF',
        'neon-purple': '#9B30FF',
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gradient: {
          start: '#667eea',
          middle: '#764ba2',
          end: '#f093fb',
        },
        neon: {
          blue: '#00f5ff',
          pink: '#ff006e',
          purple: '#8338ec',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-story': 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
        'gradient-chat': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
         'spin-slow': 'spin 6s linear infinite',
      },
        boxShadow: {
        'neon': '0 0 10px rgba(0,255,255,0.4), 0 0 20px rgba(255,0,255,0.3)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
} 
