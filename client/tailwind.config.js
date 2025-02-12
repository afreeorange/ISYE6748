import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scale: {
        "-100": "-1",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["fantasy"],
  },
};
