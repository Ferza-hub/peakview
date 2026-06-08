/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ed: {
          bg:      '#080808',
          panel:   '#111111',
          surface: '#1A1A1A',
          hover:   '#222222',
          border:  '#2A2A2A',
          muted:   '#383838',
          accent:  '#7C3AED',
          cyan:    '#06B6D4',
          green:   '#10B981',
          red:     '#EF4444',
          amber:   '#F59E0B',
        }
      }
    }
  },
  plugins: [],
}
