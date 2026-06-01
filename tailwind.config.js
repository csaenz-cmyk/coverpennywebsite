/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Coverpenny brand palette (from the mockup)
        penny: {
          50: '#FFF1F7',
          100: '#FCE3EC',
          200: '#FBD9E6',
          300: '#F8AFCB',
          400: '#F56BA3',
          500: '#F31E7A', // primary magenta-pink
          600: '#D80F66',
          700: '#B30A53',
        },
        // Kept as tokens (used across the app) but repointed to clean whites.
        cream: {
          DEFAULT: '#FFFFFF',
          light: '#FFFFFF',
        },
        paper: '#F6F5F3', // subtle neutral for occasional contrast
        ink: {
          DEFAULT: '#111111',
          soft: '#3A3A3A',
          muted: '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Unbounded"', '"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 18px 50px -20px rgba(17,17,17,0.18)',
        card: '0 10px 40px -16px rgba(243,30,122,0.18)',
        // Signature offset shadows for an editorial, non-generic card feel.
        hard: '6px 6px 0 0 #111111',
        'hard-pink': '6px 6px 0 0 #F31E7A',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        coinflip: {
          '0%': { transform: 'rotateX(-14deg) rotateY(0deg)' },
          '100%': { transform: 'rotateX(-14deg) rotateY(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(-1.5deg)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'marquee-reverse': 'marqueeReverse 50s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'spin-slow': 'spinSlow 28s linear infinite',
        'coin-flip': 'coinflip 7s linear infinite',
      },
    },
  },
  plugins: [],
}
