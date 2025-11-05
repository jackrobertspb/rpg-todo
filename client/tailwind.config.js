/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Deep blues and greens for fantasy RPG aesthetic (PRD line 128)
        primary: {
          DEFAULT: '#1e3a5f', // Deep blue
          dark: '#152238',
          light: '#2d5a8f',
        },
        secondary: {
          DEFAULT: '#2d5016', // Deep green
          dark: '#1a3009',
          light: '#4a7c2b',
        },
      },
      fontFamily: {
        'rpg': ['Georgia', 'serif'], // Fantasy RPG aesthetic font
      },
    },
  },
  plugins: [],
};


