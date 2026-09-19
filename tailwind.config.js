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
        zinc: {
          950: '#09090b',
          900: '#121215',
          850: '#18181c',
          800: '#222227',
          700: '#32323a',
          600: '#52525e',
          400: '#a1a1aa',
          300: '#d4d4d8',
          100: '#f4f4f5',
        },
        coffee: {
          DEFAULT: '#c48b59',
          hover: '#a86e3d',
          subtle: 'rgba(196, 139, 89, 0.08)',
          border: 'rgba(196, 139, 89, 0.3)',
          solid: '#c48b59',
          text: '#dfb88e',
          dark: '#8b5a2b',
          cream: '#f5ebe0',
        },
        brand: {
          DEFAULT: '#c48b59',
          400: '#dfb88e',
          500: '#c48b59',
          600: '#a86e3d',
        }
      },
      fontFamily: {
        cal: ['Cal Sans', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        ocr: ['OCR-B', 'Courier New', 'monospace']
      },
      boxShadow: {
        'sheet': '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'panel': '0 1px 3px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
