import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      screens: {
        xs: '360px',
      },
      colors: {
        ink: {
          DEFAULT: '#0B0B0F',
          50: '#F7F7F8',
          100: '#EDEDF0',
          200: '#D6D6DD',
          300: '#B1B1BD',
          400: '#7B7B8E',
          500: '#52526A',
          600: '#383850',
          700: '#23233A',
          800: '#15152A',
          900: '#0B0B0F',
        },
        paper: '#FAF7F2',
        accent: {
          DEFAULT: '#B8854A',
          50: '#FBF4EA',
          100: '#F4E3CB',
          200: '#E7C595',
          300: '#D9A75F',
          400: '#C99449',
          500: '#B8854A',
          600: '#946838',
          700: '#704E2A',
          800: '#4B341C',
          900: '#27190E',
        },
        sage: '#5F7A6C',
        rose: '#C77B7B',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'radial-fade': 'radial-gradient(circle at 30% 20%, rgba(184,133,74,0.18), transparent 55%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
