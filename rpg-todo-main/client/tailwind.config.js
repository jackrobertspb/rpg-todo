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
        // Arcane Teal - Modern RPG aesthetic
        primary: {
          DEFAULT: '#0d9488', // Teal-600 (light mode)
          dark: '#042f2e',    // Teal-950 (dark mode bg)
          light: '#14b8a6',   // Teal-500 (dark mode primary)
        },
        secondary: {
          DEFAULT: '#06b6d4', // Cyan-500 (light mode)
          dark: '#134e4a',    // Teal-900 (dark mode cards)
          light: '#22d3ee',   // Cyan-400 (dark mode secondary)
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber-500 (light mode)
          light: '#fbbf24',   // Amber-400 (dark mode)
        },
        success: {
          DEFAULT: '#22c55e', // Green-500 (light mode)
          dark: '#16a34a',    // Green-600
          light: '#4ade80',   // Green-400 (dark mode)
        },
        background: {
          DEFAULT: '#f0fdfa', // Teal-50 (light mode)
          dark: '#042f2e',    // Teal-950 (dark mode)
        },
        card: {
          DEFAULT: '#ffffff', // White (light mode)
          dark: '#134e4a',    // Teal-900 (dark mode)
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Modern body font
        'rpg': ['Cinzel', 'Georgia', 'serif'],         // Elegant headings only
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 20px 40px -10px rgba(0, 0, 0, 0.1)',
        // Dark mode shadows - darker and more subtle
        'card-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.2)',
        'card-hover-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 20px 40px -10px rgba(0, 0, 0, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'float-up': 'floatUp 2s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'slide-down': 'slideDown 0.3s ease-out forwards',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateY(-100px) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translateY(-200px) scale(1)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};


