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
        // Deep umber-black — never pure black
        ink: {
          DEFAULT: '#1C1410',
          50: '#F5F1EA',
          100: '#E8E0D2',
          200: '#CFC2AE',
          300: '#A89679',
          400: '#76624A',
          500: '#4F3F2D',
          600: '#3A2C1F',
          700: '#2A2017',
          800: '#1C1410',
          900: '#100A07',
        },
        // Warm oat / pressed-clay paper
        paper: {
          DEFAULT: '#F4EBD9',
          50: '#FBF7EE',
          100: '#F8F1E1',
          200: '#F4EBD9',
          300: '#EADDC2',
          400: '#DFCBA4',
        },
        // Terracotta — the signature accent
        accent: {
          DEFAULT: '#B85C38',
          50: '#FBF0EA',
          100: '#F4DDD0',
          200: '#E8B89C',
          300: '#D89370',
          400: '#C77450',
          500: '#B85C38',
          600: '#964828',
          700: '#73371E',
          800: '#502615',
          900: '#2C150B',
        },
        // Ochre / gold leaf — highlights, dividers
        ochre: {
          DEFAULT: '#D4A24C',
          50: '#FAF1DD',
          100: '#F4E2B9',
          200: '#EACA7E',
          300: '#DDB05E',
          400: '#D4A24C',
          500: '#B98735',
          600: '#8E6627',
          700: '#62461B',
          800: '#37270F',
        },
        // Deep forest — sparingly, for trust / utility
        forest: {
          DEFAULT: '#3D4B3C',
          50: '#EEF1ED',
          100: '#D5DDD3',
          200: '#A8B8A4',
          300: '#7A9075',
          400: '#566B52',
          500: '#3D4B3C',
          600: '#2D372C',
        },
        // Legacy aliases kept so existing components don't break
        sage: '#5F7A6C',
        rose: '#C77B7B',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'radial-fade':
          'radial-gradient(circle at 30% 20%, rgba(184,92,56,0.18), transparent 55%)',
        // Layered editorial mesh — warm clay + ochre + forest, soft
        'editorial-mesh':
          'radial-gradient(at 18% 12%, rgba(184,92,56,0.18) 0px, transparent 50%), radial-gradient(at 82% 18%, rgba(212,162,76,0.16) 0px, transparent 50%), radial-gradient(at 50% 88%, rgba(61,75,60,0.12) 0px, transparent 55%)',
        'mesh-warm':
          'radial-gradient(at 20% 100%, rgba(184,92,56,0.22) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(212,162,76,0.18) 0px, transparent 50%)',
      },
      boxShadow: {
        // Layered editorial card shadow
        editorial:
          '0 1px 0 rgba(255,255,255,0.55) inset, 0 1px 2px rgba(28,20,16,0.04), 0 18px 40px -24px rgba(28,20,16,0.22)',
        // Stronger glass-card lift
        glass:
          '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px -8px rgba(28,20,16,0.10), 0 32px 64px -32px rgba(28,20,16,0.20)',
        // Accent glow for primary CTAs on hover
        'accent-glow': '0 12px 28px -12px rgba(184,92,56,0.55)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        // Slow mesh drift for hero backgrounds
        'mesh-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(-2%, 1%, 0) scale(1.05)' },
        },
        // Subtle aurora pulse for accent moments
        aurora: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'mesh-drift': 'mesh-drift 18s ease-in-out infinite',
        aurora: 'aurora 6s ease-in-out infinite',
      },
      transitionTimingFunction: {
        // Editorial easing — slow exit, snappy entry
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
