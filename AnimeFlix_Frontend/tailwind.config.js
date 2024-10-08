/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "hookers-green": {
          DEFAULT: "#5a7d7c",
          100: "#121919",
          200: "#243231",
          300: "#364b4a",
          400: "#486362",
          500: "#5a7d7c",
          600: "#769c9a",
          700: "#98b4b4",
          800: "#bacdcd",
          900: "#dde6e6",
        },
        "lavender-web": {
          DEFAULT: "#dadff7",
          100: "#111b4c",
          200: "#213598",
          300: "#415ad5",
          400: "#8d9ce6",
          500: "#dadff7",
          600: "#e1e5f8",
          700: "#e8ebfa",
          800: "#f0f2fc",
          900: "#f7f8fd",
        },
        gunmetal: {
          DEFAULT: "#232c33",
          100: "#07090a",
          200: "#0e1215",
          300: "#151b1f",
          400: "#1c2429",
          500: "#232c33",
          600: "#455866",
          700: "#688398",
          800: "#9aacba",
          900: "#cdd6dd",
        },
        "powder-blue": {
          DEFAULT: "#a0c1d1",
          100: "#182932",
          200: "#305263",
          300: "#487b95",
          400: "#6d9fb9",
          500: "#a0c1d1",
          600: "#b2cdda",
          700: "#c5d9e3",
          800: "#d8e6ec",
          900: "#ecf2f6",
        },
        "french-gray": {
          DEFAULT: "#b5b2c2",
          100: "#22212a",
          200: "#454253",
          300: "#67627d",
          400: "#8d88a2",
          500: "#b5b2c2",
          600: "#c4c1cf",
          700: "#d3d1db",
          800: "#e1e0e7",
          900: "#f0f0f3",
        },
      },
    },
  },
  plugins: [],
};
