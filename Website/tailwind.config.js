/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        primaryRedBlue: "#4f46e5",
        crimson: "#dc2626",
        secondary: "#1e293b",
        accent: "#38bdf8",
        background: "#f8fafc",
        sunrise: "#f97316",
        lagoon: "#06b6d4",
        indigoDeep: "#3730a3"
      },
      borderRadius: {
        card: "16px"
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(37,99,235,0.08)",
        glow: "0 18px 48px rgba(37, 99, 235, 0.2)",
        float: "0 14px 30px rgba(15, 23, 42, 0.16)",
        rubyBlue: "0 18px 44px rgba(79, 70, 229, 0.22)"
      }
    }
  },
  plugins: []
}
