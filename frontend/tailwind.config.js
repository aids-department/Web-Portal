/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Full override (not extend): every existing rounded-*/shadow-* utility
    // in the app goes flat/shadowless with zero per-file edits, per the
    // "0 radius everywhere" / "never shadowed" brand spec.
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    boxShadow: {
      sm: 'none',
      DEFAULT: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      inner: 'none',
      none: 'none',
    },
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0e1c3d',
          deep: '#0b1730',
        },
        'ds-blue': {
          DEFAULT: '#1b3a6b',
          tint: '#e4eaf4',
        },
        'on-navy': '#b6c2d8',
        'on-navy-muted': '#8c9ab5',
        ds: {
          red: '#dd2b0f',
          'red-deep': '#ae1800',
          'red-tint': '#ffe0d9',
          ink: '#201e1d',
          'ink-soft': '#605d5d',
          'ink-faint': '#9b9797',
          edge: '#d7d3d3',
          row: '#eae7e7',
          ground: '#f3f2f2',
        },
      },
      fontSize: {
        display: ['62px', { lineHeight: '1.05', letterSpacing: '-.02em', fontWeight: '600' }],
        'page-heading': ['42px', { lineHeight: '1.1', letterSpacing: '-.02em', fontWeight: '600' }],
        'section-heading': ['24px', { lineHeight: '1.25', fontWeight: '600' }],
        'card-title': ['17px', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['14.5px', { lineHeight: '1.7', fontWeight: '400' }],
        label: ['12.5px', { lineHeight: '1.4', fontWeight: '500' }],
        kicker: ['10.5px', { lineHeight: '1.4', letterSpacing: '.2em', fontWeight: '500' }],
        'table-head': ['10.5px', { lineHeight: '1.4', letterSpacing: '.16em', fontWeight: '600' }],
        figure: ['28px', { lineHeight: '1.1', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }],
      },
      letterSpacing: {
        display: '-.02em',
        kicker: '.2em',
        label: '.16em',
      },
      spacing: {
        gutter: '48px',
        'gutter-mobile': '20px',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [],
}