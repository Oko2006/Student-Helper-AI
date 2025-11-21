/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a1a',
        'dark-surface': '#242424',
        'dark-hover': '#2d2d2d',
        'dark-border': '#3a3a3a',
        'dark-text': '#e0e0e0',
        'dark-text-secondary': '#a0a0a0',
        'accent-blue': '#60a5fa',
        'accent-purple': '#a78bfa',
      },
    },
  },
  plugins: [],
}
