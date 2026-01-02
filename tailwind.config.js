/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stoic: {
          bg: '#0f172a',    // Deep Navy/Slate Mix
          card: '#1e293b',  // Slate
          text: '#94a3b8',  // Muted Text
          light: '#e2e8f0', // Light Text
          accent: '#334155', // Border/Accent
          danger: '#ef4444', 
          safe: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
