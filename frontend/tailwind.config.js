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
        background: '#000000',
        surface: {
          DEFAULT: '#0d0d10',
          hover: '#141418',
          raised: '#1a1a20',
          card: '#101014',
        },
        border: {
          DEFAULT: '#222228',
          subtle: '#1c1c22',
          hover: '#33333d',
        },
        accent: {
          DEFAULT: '#6E56CF',
          hover: '#7D67D9',
          light: '#8E78E6',
          muted: 'rgba(110, 86, 207, 0.15)',
        },
        foreground: {
          DEFAULT: '#ffffff',
          muted: '#a1a1aa',
          faint: '#71717a',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(110, 86, 207, 0.25)',
        'glow-md': '0 0 30px -5px rgba(110, 86, 207, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
