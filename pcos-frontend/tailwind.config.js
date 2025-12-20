/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft pink palette
        'soft-pink': {
          50: '#FFF5F7',
          100: '#FFE4E9',
          200: '#FFC9D4',
          300: '#FFB6C1',
          400: '#FFA3B0',
          500: '#FF8FA3',
          600: '#FF7B96',
          700: '#E95D7B',
          800: '#D43F60',
          900: '#B82145',
        },
        // Warm beige palette
        'warm-beige': {
          50: '#FAF8F5',
          100: '#F5E6D3',
          200: '#EDD9C3',
          300: '#E8D5C4',
          400: '#D9C3A9',
          500: '#C9B18E',
          600: '#B89F73',
          700: '#9E875F',
          800: '#846F4B',
          900: '#6A5737',
        },
        // Sage green palette
        'sage': {
          50: '#F4F6F1',
          100: '#E8EDE4',
          200: '#D5DEC9',
          300: '#C1CFAE',
          400: '#ADC093',
          500: '#9CAF88',
          600: '#87A96B',
          700: '#729250',
          800: '#5D7A41',
          900: '#486132',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'card': '1rem',
      },
    },
  },
  plugins: [],
}
