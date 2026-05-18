/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: "#f5efe4",
        plate: "#fffaf2",
        plateBlue: "#e7f0fb",
        plateMint: "#dfeedd",
        platePeach: "#f7dfcd",
        plateLemon: "#efe5bd",
        line: "#d6cdbc",
        ink: "#1f2937",
        muted: "#6b7280",
        accent: "#2563eb",
        accentDark: "#1d4ed8",
        accentSoft: "#dbe8ff",
        successSoft: "#dcefd6",
        warnSoft: "#f4e2ae",
        roseSoft: "#f6d7d7",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        plate: "0 8px 24px rgba(74, 66, 53, 0.08)",
      },
    },
  },
  plugins: [],
};
