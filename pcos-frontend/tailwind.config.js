/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced soft pink palette with vibrant variations
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
        // Enhanced sage green palette
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
        // New vibrant purple palette for accents
        'vibrant-purple': {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'glow-pink': '0 0 20px rgba(255, 143, 163, 0.4), 0 0 40px rgba(255, 143, 163, 0.2)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
        'lift': '0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      borderRadius: {
        'card': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 143, 163, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 143, 163, 0.6), 0 0 40px rgba(255, 143, 163, 0.4)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
      },
    },
  },
  plugins: [],
}
