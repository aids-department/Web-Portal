/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // Used only by pages/components migrated to the new design system.
        // Kept separate from `sans` so unmigrated pages keep their existing font.
        brand: ['Archivo', 'sans-serif'],
      },
      colors: {
        // AI & DS design system tokens (see newdesign/Brand Guide.dc.html).
        // Prefixed "brand-" so they never collide with existing color usage.
        brand: {
          navy: '#0e1c3d',
          'navy-deep': '#0b1730',
          blue: '#1b3a6b',
          'blue-tint': '#e4eaf4',
          'on-navy': '#b6c2d8',
          'on-navy-muted': '#8c9ab5',
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
    },
  },
  plugins: [],
}