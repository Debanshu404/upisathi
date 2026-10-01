/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        default: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        
        // Amplemarket Design System Palette
        'phoenix-orange': '#e8400d',
        'midnight-indigo': '#10054d',
        'charcoal': '#272625',
        'ink': '#111111',
        'canvas-white': '#ffffff',
        'cream-wash': '#f6f5f3',
        'ash': '#6d6c6b',
        'stone': '#b1b1af',
        'pearl': '#ecebea',
        
        // Pastel taxonomy tiles
        'petal-pink': '#ffd7f0',
        'mint-green': '#b7efb2',
        'canary-yellow': '#ffef99',
        'soft-violet': '#e2ddfd',
        'aqua': '#99fff9',
        'indigo-deep': '#2e2460',

        indigo: {
          650: '#493fdf',
        },
        slate: {
          250: '#d7dee8',
          350: '#b2bfd2',
          450: '#7c8ba1',
          650: '#3d4b5f',
          850: '#162032',
          855: '#121b2c',
        }
      },
      borderRadius: {
        'btn': '8px',
        'tile': '12px',
      },
      letterSpacing: {
        'display': '-2.52px',
        'heading-lg': '-2.8px',
        'heading': '-1.76px',
        'heading-sm': '-1.08px',
      }
    },
  },
  plugins: [],
}
