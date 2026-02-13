import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C84C3C',    // Vintage Car Red
        secondary: '#4A6FA5',  // Muted Sky Blue
        accent: '#F4A261',     // Poster Title Yellow/Orange
        background: '#FDFCF6', // Off-white Paper
        surface: '#EAE2CF',    // Warm Building Beige
        text: '#1A2C42',       // Deep Navy/Black
        success: '#2A9D8F',
        warning: '#E9C46A',
        error: '#D62828',
        
        // Phase 2: Expedition Journal Colors
        paper: '#F3E8D3',      // Aged Paper
        ink: '#1F2A44',        // Deep Blue Ink
        'stamp-red': '#6E2C2C', // Burgundy Stamp
        gold: '#C4A962',       // Mute Gold
      },
      fontFamily: {
        sans: ['"Libre Baskerville"', 'serif'],
        serif: ['"Playfair Display"', 'serif'],
        journal: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cinzel"', 'serif'],
        hand: ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
