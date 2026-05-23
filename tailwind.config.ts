import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: '#FFFFFF', dark: '#111111' },
        panel: { DEFAULT: '#F8F8F8', dark: '#1A1A1A' },
        border: { DEFAULT: '#E5E5E5', dark: '#2A2A2A' },
        primary: { DEFAULT: '#7C3AED', light: '#EDE9FE', dark: '#6D28D9' },
        accent: { DEFAULT: '#059669', light: '#D1FAE5', dark: '#047857' },
        code: { DEFAULT: '#0D1117', light: '#F6F8FA' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter var', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
} satisfies Config
