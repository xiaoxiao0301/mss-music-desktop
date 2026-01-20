/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#FFF8F0",
          card: "#FFFFFF",
          primary: "#E67E22",
          secondary: "#F5CBA7",
          text: "#4A3F35",
          subtext: "#7F7368",
        },
      },
      boxShadow: {
        warm: "0 4px 10px rgba(230, 126, 34, 0.15)",
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
