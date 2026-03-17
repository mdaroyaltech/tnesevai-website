/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        gov: {
          dark:   '#0f2a1a',
          medium: '#1a3d28',
          light:  '#235c3a',
        }
      },
      fontFamily: {
        tamil:   ['Noto Sans Tamil', 'sans-serif'],
        display: ['Tiro Devanagari Sanskrit', 'Mukta', 'sans-serif'],
        body:    ['Hind', 'sans-serif'],
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        marquee: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } },
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'slide-in':   'slideIn 0.4s ease-out forwards',
        'marquee':    'marquee 35s linear infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
    },
  },
  plugins: [],
};
