/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        warm1: '#FDEAD7',
        warm2: '#F9DCC4',
        warm3: '#F9C6AA',
        cocoa: '#7A564E',
        dusk: '#3B2F2F',
      },
      boxShadow: {
        cozy: '0 10px 30px -10px rgba(122, 86, 78, 0.3)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}


