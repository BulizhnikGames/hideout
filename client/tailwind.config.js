/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'dark-primary': '#131a1c',
      'dark-secondary': '#1b2224',
      red: '#ed7878',
      lightred: '#ff8080',
      green: '#6bb05d',
      lightgreen: '#80ffaa',
      blue: '#0183ff',
      lb: '#4da9ff',
      lightblue: '#4da9ff',
      grey: '#dddfe2',
      white: '#fff',
    },
  },
  plugins: [],
}

