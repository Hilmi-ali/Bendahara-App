/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",

  content: ["./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#1E293B",
        success: "#16A34A",
        danger: "#DC2626",
        warning: "#F59E0B",
        background: "#F8FAFC",
        darkbg: "#09090B",
        card: "#FFFFFF",
        darkcard: "#18181B",
      },

      borderRadius: {
        xl2: "20px",
      },

      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.08)",

        dark: "0 10px 25px rgba(0,0,0,.45)",
      },
    },
  },

  plugins: [],
};
