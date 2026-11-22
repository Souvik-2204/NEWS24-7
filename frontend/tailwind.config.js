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
        paper: {
          50: '#fdfcf9',
          100: '#f8f6f0',
          150: '#f3ede2',
          200: '#ebe3d4',
          300: '#e5ddcf',
          400: '#cfc4b2',
          500: '#a39580',
          600: '#756855',
          700: '#4f4435',
          800: '#2e271d',
          900: '#1c1917',
        },
        beige: {
          50: '#fcfbf8',
          100: '#f8f5ee',
          200: '#efe9dc',
          300: '#dfd5c2',
          400: '#c8b69b',
          500: '#ab9577',
          600: '#8c7457',
          700: '#6c563e',
          800: '#4e3c2b',
          900: '#32261a',
        },
        accent: {
          DEFAULT: '#946638',
          camel: '#946638',
          cognac: '#855627',
          warm: '#b8895b',
          sand: '#d8c7b0',
          cream: '#f5eee2',
          dark: '#6b4620',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
