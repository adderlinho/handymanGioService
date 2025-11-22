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
        "primary": "#0F766E",
        "accent": "#F97316",
        "background-light": "#F8FAFC",
        "background-dark": "#111827",
        "text-light": "#1F2937",
        "text-dark": "#F3F4F6",
        "border-light": "#E5E7EB",
        "border-dark": "#374151"
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