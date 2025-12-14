/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        farm: {
          green: "#15803d", // Deep organic green (green-700 equivalent)
          dark: "#064e3b",  // Darker forest green (emerald-900 equivalent)
          light: "#dcfce7", // Very light green
          accent: "#d97706", // Earthy orange/amber
          cream: "#fcfbf8", // Warm off-white background
        }
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
