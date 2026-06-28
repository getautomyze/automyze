/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        'luxury-white': '#FAFAF8',
        'luxury-beige': '#F2F0EB',
        'luxury-black': '#0A0A0A',
        'luxury-gold': '#C9A96E',
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'script': ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
