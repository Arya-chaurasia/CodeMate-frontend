module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5'
        }
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        codemate: {
          primary: '#4f46e5',
          'primary-focus': '#4338ca',
          neutral: '#f3f4f6',
          'base-100': '#ffffff',
          '--rounded-box': '1rem'
        }
      },
      'dark'
    ]
  }
}