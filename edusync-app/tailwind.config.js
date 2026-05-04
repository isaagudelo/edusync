/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: "#eff6ff", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8" },
        slate: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 400: "#94a3b8", 700: "#334155", 800: "#1e293b" }
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { "2xl": "1rem", "3xl": "1.5rem" },
      boxShadow: {
        "soft": "0 2px 15px 0 rgba(0, 0, 0, 0.05)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }
    }
  },
  plugins: []
}