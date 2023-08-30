/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}","./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        timer: ['Orbitron', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

