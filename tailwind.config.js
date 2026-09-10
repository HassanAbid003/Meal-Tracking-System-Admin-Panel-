
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B1120',
          800: '#151929',
          700: '#1E2436',
          600: '#2B3348'
        },
        brand: {
          500: '#6366F1',
          400: '#818CF8'
        }
      },
      // ADD THESE TO MAKE VS CODE HAPPY
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        '120px': '120px',
      },
      whitespace: {
        normal: 'normal',
      },
    },
  },
  plugins: [],
}