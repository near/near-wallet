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
      // Radix UI Colors: https://www.radix-ui.com/docs/colors/palette-composition/the-scales
      ...gray,
      ...blue,
      ...red,
      ...green,
    },

    space: {
      1: '4px',
      2: '6px',
      3: '8px',
      4: '12px',
      5: '16px',
      6: '24px',
      7: '32px',
      8: '48px',
      9: '56px',
    },

    fontSizes: {
      // Scale
      1: '12px',
      2: '14px',
      3: '16px',
      4: '18px',
      5: '24px',
      6: '40px',

      // Aliases
      small: '$1',
      body: '$2',
      input: '$3',
    },

    fonts: {
      default: 'Inter, Untitled Sans, apple-system, sans-serif',
      mono: 'Söhne Mono, menlo, monospace',
    },

    fontWeights: {
      normal: '500',
      semibold: '600',
      bold: '700',
    },

    lineHeights: {
      label: '1',
      body: '1.3',
      heading: '1.5',
    },

    sizes: {
      1: '16px',
      2: '32px',
      3: '48px',
    },

    radii: {
      small: '4px',
      regular: '8px',
      large: '32px',
      round: '50px',
    },

    shadows: {},
    zIndices: {},
    transitions: {},
  },

  media: {
    bp1: '(min-width: 600px)',
    bp2: '(min-width: 900px)',
    bp3: '(min-width: 1200px)',
    bp4: '(min-width: 1800px)',
  },

  utils: {
    marginX: (config) => (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
  },
});
