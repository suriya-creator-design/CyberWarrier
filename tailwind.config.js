/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#06090F',
          dark: '#0A0F1D',
          surface: '#0E1726',
          card: 'rgba(14, 23, 38, 0.75)',
          border: 'rgba(56, 189, 248, 0.16)',
          borderGlow: 'rgba(6, 182, 212, 0.35)',
          cyan: '#00F0FF',
          blue: '#2563EB',
          electric: '#38BDF8',
          green: '#10B981',
          orange: '#F59E0B',
          red: '#EF4444',
          purple: '#8B5CF6',
          muted: '#64748B',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -5px rgba(0, 240, 255, 0.3)',
        'red-glow': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
        'green-glow': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'purple-glow': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(56, 189, 248, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
