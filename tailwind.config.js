/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'temple-black': '#0a0501',
        'temple-dark': '#120a03',
        'sacred-gold': '#C9960C',
        'gold-light': '#E8B84B',
        'gold-pale': '#F5D98A',
        'gold-dark': '#9B6E0A',
        'gold-glow': '#FFD700',
        'vermillion': '#8B1A1A',
        'vermillion-light': '#C0392B',
        'ivory': '#FAF3E0',
        'ivory-dark': '#E8D9B8',
        'smoke': '#1a0f05',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 25s linear infinite',
        'spin-medium': 'spin 10s linear infinite',
        'spin-reverse': 'spinReverse 18s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'flame': 'flame 1.2s ease-in-out infinite alternate',
        'flame-inner': 'flameInner 1.5s ease-in-out infinite alternate',
        'particle': 'particle 12s ease-in-out infinite',
        'ken-burns': 'kenBurns 8s ease-in-out forwards',
        'gold-radiate': 'goldRadiate 3s ease-in-out infinite',
      },
      keyframes: {
        spinReverse: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 8px rgba(201,150,12,0.4))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 30px rgba(201,150,12,0.9)) drop-shadow(0 0 60px rgba(201,150,12,0.5))',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400% center' },
          '100%': { backgroundPosition: '400% center' },
        },
        flame: {
          '0%': { transform: 'scaleY(1) scaleX(1) translateY(0)' },
          '100%': { transform: 'scaleY(1.15) scaleX(0.88) translateY(-2px)' },
        },
        flameInner: {
          '0%': { transform: 'scaleY(1) scaleX(1)' },
          '100%': { transform: 'scaleY(1.25) scaleX(0.82)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) rotate(0deg) scale(0)', opacity: '0' },
          '5%': { opacity: '1', transform: 'scale(1)' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-80vh) rotate(540deg) scale(0)', opacity: '0' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
        goldRadiate: {
          '0%, 100%': { boxShadow: '0 0 40px 10px rgba(201,150,12,0.2)' },
          '50%': { boxShadow: '0 0 80px 30px rgba(201,150,12,0.5), 0 0 120px 50px rgba(201,150,12,0.2)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #9B6E0A, #C9960C, #E8B84B, #C9960C, #9B6E0A)',
        'temple-gradient': 'radial-gradient(ellipse at center, #1a0f05 0%, #0a0501 70%)',
        'sacred-overlay': 'linear-gradient(180deg, rgba(10,5,1,0.3) 0%, rgba(10,5,1,0.7) 100%)',
      },
    },
  },
  plugins: [],
}
