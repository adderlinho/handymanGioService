/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#DC143C",
        "accent": "#000000",
        "background-light": "#FFFFFF",
        "background-dark": "#000000",
        "text-light": "#000000",
        "text-dark": "#FFFFFF",
        "border-light": "#DC143C",
        "border-dark": "#DC143C"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}