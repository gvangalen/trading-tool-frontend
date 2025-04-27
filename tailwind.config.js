/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 🌙 Dark mode via 'class'
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',   // optioneel: je eigen kleurenschema
        secondary: '#22c55e',
      },
    },
  },
  plugins: [],
};
