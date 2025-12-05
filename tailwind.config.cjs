// tailwind.config.cjs
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        frog: {
          50: "#e8f5e9",
          100: "#f1f8f1",
          200: "#a5d6a7",
          800: "#2e7d32",
          900: "#1b5e20",
        },
      },
    },
  },
  plugins: [],
};
