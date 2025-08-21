/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        farm: {
          green: "#16a34a",
          dark: "#065f46",
          light: "#dcfce7"
        }
      }
    },
  },
  plugins: [],
}
