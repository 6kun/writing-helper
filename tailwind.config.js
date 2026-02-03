/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Typora 风格配色 - 极简现代
        'pure-white': '#FFFFFF',
        'bg-gray': '#FAFAFA',
        'light-gray': '#F5F5F5',
        'border-gray': '#E0E0E0',
        'text-primary': '#2C3E50',
        'text-secondary': '#7F8C8D',
        'text-muted': '#BDC3C7',
        'accent': {
          DEFAULT: '#5B9BD5',
          light: '#7BAADE',
          dark: '#4A7FB5',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: theme('colors.text-primary'),
            lineHeight: '1.7',
            letterSpacing: '0.01em',
            h1: {
              color: theme('colors.text-primary'),
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            h2: {
              color: theme('colors.text-primary'),
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            h3: {
              color: theme('colors.text-primary'),
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            p: {
              color: theme('colors.text-primary'),
            },
            a: {
              color: theme('colors.accent.DEFAULT'),
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: theme('colors.accent.dark'),
              },
            },
          },
        },
      }),
      boxShadow: {
        'minimal': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'minimal-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    import('@tailwindcss/typography'),
  ],
} 