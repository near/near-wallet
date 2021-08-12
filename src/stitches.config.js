import { createCss } from '@stitches/react';
import {
  gray,
  blue,
  red,
  green,
  grayDark,
  blueDark,
  redDark,
  greenDark,
} from '@radix-ui/colors';

export const { styled, css } = createCss({
  theme: {
    colors: {
      ...gray,
      ...blue,
      ...red,
      ...green,
    },

    space: {
      1: '5px',
      2: '10px',
      3: '15px',
    },

    fontSizes: {
      1: '12px',
      2: '13px',
      3: '15px',
    },

    fonts: {
      untitled: 'Untitled Sans, apple-system, sans-serif',
      mono: 'Söhne Mono, menlo, monospace',
    },

    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },

  media: {
    bp1: '(min-width: 480px)',
  },

  utils: {
    marginX: (config) => (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
  },
});
