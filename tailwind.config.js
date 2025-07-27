/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    fontFamily: {
      script: ['Pacifico', 'cursive'], // for "shining" & "paw"
      serif: ['Playfair Display', 'serif'], // HOPE
      bold: ['Poppins', 'sans-serif'], // "FOR EVERY"
    },
    colors: {
      pawBlue: '#2bb6b1',   // custom paw color
      sparklePink: '#f7a6c1' // for sparkle
    }
  }
},
  plugins: [],
}
