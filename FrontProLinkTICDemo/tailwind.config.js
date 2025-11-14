/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],

  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'ul': {
              listStyleType: 'disc',
              paddingLeft: '1em'
            },
            'ol': {
              listStyleType: 'decimal',
              paddingLeft: '1em'
            },
            'h1': {
              fontSize: '2em'
            },
            'h2': {
              fontSize: '1.5em'
            },
          }
        }
      }),
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        label: "var(--labels)",
        bg: "#F8F8F8",
        "blue-linktic": "var(--primary)",
        "blue-intense": "var(--secondary)",
        "gray-texts": "#EAECF0",
        "gray-dark": "#787E8C",
        "green-light": "#EBF8EA",
        redtrigger: "#FFDFDF",
        redbordertrigger: "#EA0000",
        "red-button": "#C80000",
        "gray-sky": "#EAECF0",
        "blue-fondo": "#F2FDF1",
        "blue-light": "#F5F7FB",
        background: "#F5F7FB",
        "blue-lighter": "#E0F3FE",
        blue: "#006FB0",
        "orange-button": "#FF7500",
        rosa: "#FDE5E5",
        "border-gray": "#A5B1BF",
        "modal-blue-main-title": "#0A1B48",
        "modal-grey-subtitle": "#6B737C",
        "modal-subtitle-description": "#2C3948",
        "modal-input": "#2C3948",
        "modal-black-button": "#2C3948",
      },
    },
    maxWidth: {
      '85vw': '85vw'
    },
  },
  plugins: [],
};
