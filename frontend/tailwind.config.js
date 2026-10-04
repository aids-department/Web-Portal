/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Geist Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // Design tokens — "Linear / Modern" system. Every page reads from these;
      // avoid hard-coding hex values in components.
      colors: {
        canvas: {
          deep: '#020203',
          DEFAULT: '#050506',
          elevated: '#0a0a0c',
          input: '#0F0F12',
        },
        fg: {
          DEFAULT: '#EDEDEF',
          muted: '#8A8F98',
          subtle: 'rgba(255,255,255,0.60)',
        },
        accent: {
          DEFAULT: '#5E6AD2',
          bright: '#6872D9',
          glow: 'rgba(94,106,210,0.3)',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          hover: 'rgba(255,255,255,0.10)',
          accent: 'rgba(94,106,210,0.30)',
        },
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.06), 0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)',
        'card-hover': '0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(94,106,210,0.1)',
        glow: '0 0 0 1px rgba(94,106,210,0.5), 0 4px 12px rgba(94,106,210,0.3), inset 0 1px 0 0 rgba(255,255,255,0.2)',
        'glow-lg': '0 0 0 1px rgba(104,114,217,0.6), 0 6px 24px rgba(94,106,210,0.45), inset 0 1px 0 0 rgba(255,255,255,0.25)',
        'inner-hl': 'inset 0 1px 0 0 rgba(255,255,255,0.1)',
        popover: '0 0 0 1px rgba(255,255,255,0.08), 0 16px 48px rgba(0,0,0,0.6), 0 0 60px rgba(94,106,210,0.08)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        'float-alt': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(24px, -16px) rotate(-1deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        'float-slow': 'float-alt 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 8s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
