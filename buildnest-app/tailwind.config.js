/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef3e2",
          100: "#fde4b9",
          200: "#fbd48c",
          300: "#f9c35e",
          400: "#f7b63e",
          500: "#f5a623",
          600: "#e8950f",
          700: "#cc7d00",
          800: "#b06800",
          900: "#8c5000",
        },
        dark: {
          50: "#f5f5f6",
          100: "#e5e6e8",
          200: "#c8cace",
          300: "#a0a4ab",
          400: "#737882",
          500: "#585d67",
          600: "#3f4450",
          700: "#282d38",
          800: "#1a1f28",
          900: "#0f1218",
          950: "#080a0e",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
