/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  // prefix: 'tw-',
  theme: {
    extend: {
      colors: {
        signature: 'var(--primary)',
        'btn-primary': 'var(--btn-primary)',
        'btn-secondary': 'var(--btn-secondary)',
        'btn-primary-hover': 'var(--btn-primary-hover)',
        text_hover: 'var(--text-hover)',
        'btn-cancel': 'var(--btn-cancel)',
        'btn-cancel-hover': 'var(--btn-cancel-hover)',
      },
    },
    screens: {
      sm: '320px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
