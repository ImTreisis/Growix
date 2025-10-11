/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        warm1: '#f8f9fa',
        warm2: '#e9ecef',
        warm3: '#dee2e6',
        cocoa: '#6c757d',
        dusk: '#212529',
      },
      boxShadow: {
        cozy: '0 4px 20px rgba(0, 0, 0, 0.12)',
        subtle: '0 2px 12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
}


