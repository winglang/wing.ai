const colors = require('tailwindcss/colors');

/**
 * Extracts the value of the RGB components an hexadecimal color.
 * @param {string} color
 * @returns {[number, number, number]} The decimal value of the RGB components
 */
const rgbFromColor = (color) => [
  Number.parseInt(color.slice(1, 3), 16),
  Number.parseInt(color.slice(3, 5), 16),
  Number.parseInt(color.slice(5, 7), 16)
];

/**
 * Returns the value between two numbers.
 * @param {number} value1
 * @param {number} value2
 * @returns
 */
const mixColorComponent = (value1, value2) => {
  const max = Math.max(value1, value2);
  const min = Math.min(value1, value2);
  return Math.round(min + (max - min) / 2);
};

/**
 * Mix two hexadecimal colors.
 * @param {string} color1
 * @param {string} color2
 * @returns The mixed hexadecimal color.
 * @example ```ts
 * const color = mixColor("#666666", "#888888"); // "#777777"
 * ```
 */
const mixColor = (color1, color2) => {
  const rgb1 = rgbFromColor(color1);
  const rgb2 = rgbFromColor(color2);
  const r = mixColorComponent(rgb1[0], rgb2[0]);
  const g = mixColorComponent(rgb1[1], rgb2[1]);
  const b = mixColorComponent(rgb1[2], rgb2[2]);
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};

const expandColor = (color) => {
  return {
    ...color,
    150: mixColor(color[100], color[200]),
    250: mixColor(color[200], color[300]),
    350: mixColor(color[300], color[400]),
    450: mixColor(color[400], color[500]),
    550: mixColor(color[500], color[600]),
    650: mixColor(color[600], color[700]),
    750: mixColor(color[700], color[800]),
    850: mixColor(color[800], color[900])
  };
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.storybook/**/*',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/shared/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['IBM Plex Sans']
    },
    extend: {
      colors: {
        gray: expandColor(colors.gray),
        slate: expandColor(colors.slate),
        'monada-light': '#AEF8EC',
        'monada-dark': '#2ad5c1',
        'monada-black': '#03120E'
      },
      fontSize: {
        '2xs': '0.7rem'
      },
      screens: {
        small: '1200px',
        medium: '1400px'
      }
    }
  }
};
