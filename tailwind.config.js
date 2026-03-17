/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    'reveal','reveal-left','reveal-scale','visible',
    'anim-slide-up','anim-slide-right','anim-pop-in','anim-fade-up',
    'd1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12',
  ],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d',950:'#052e16' },
        gold: { 300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706' },
        gov: { dark:'#050f05',medium:'#0f2a1a',light:'#166534' },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"','Mukta','sans-serif'],
        body:    ['"Plus Jakarta Sans"','Hind','sans-serif'],
        tamil:   ['"Noto Sans Tamil"','sans-serif'],
        mono:    ['"JetBrains Mono"','monospace'],
      },
      borderRadius: { '4xl':'2rem','5xl':'2.5rem' },
    },
  },
  plugins: [],
};
