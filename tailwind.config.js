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
        cream: {
          DEFAULT: '#FBF4EA',
          light: '#FDF7EF',
        },
        ink: {
          DEFAULT: '#111111',
          soft: '#3A3A3A',
          muted: '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 18px 50px -20px rgba(17,17,17,0.18)',
        card: '0 10px 40px -16px rgba(243,30,122,0.18)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
