import { globalCss } from './stitches.config';

const globalStylesObj = {
  ':root': {
    '--font-text': [
      "'Inter', sans-serif, -apple-system, 'Segoe UI', Helvetica Neue, Helvetica, Roboto, sans-serif, system-ui, 'Apple Color Emoji', 'Segoe UI Emoji'",
    ],
  },
  '*,*::before,*::after': {
    margin: 0,
    padding: 0,
    boxSizing: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 500,
    fontFamily: 'inherit',
    color: 'inherit',
    lineHeight: '1.2',
    fontFeatureSettings: 'kern',
    webkitFontSmoothing: 'antialiased',
    textRendering:'optimizeLegibility'
  },
  'html, body': {
    minWidth: '320px',
    textSizeAdjust: '100%',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    backgroundColor: '$white',
    color: '$black',
  },
  html: {
    boxSizing: 'border-box', 
    height: '100%', 
    quotes: `'"' '"'`,
   },
  body: {
    fontWeight: '400',
    padding: '0px',
    overflowX: 'hidden',
    fontSize: '14px',
    fontFamily: 'var(--font-text)',
    fontStyle: 'normal',
    textRendering: 'optimizelegibility',
    transition: 'background-color 0.2s ease',
  },
  '#root': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  'body, button, input, select, textarea': {
    direction: 'ltr',
    textAlign: 'left',
    fontSynthesis: 'none',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    MozFontFeatureSettings: "'kern'",
  },
  img: { height: '100%', width: '100%' },
  svg: { maxWidth: '100%', verticalAlign: 'middle', strokeWidth: '1.5' },
  ul: {

      listStyle: 'disc',
      '-webkit-padding-start': '40px',
      '-webkit-margin-before': '40px',
      'margin-block-start': '40px',
      '-webkit-margin-after': 'unset',
      'margin-block-end': 'unset',

   },
  a: { 
    textDecoration: 'none',
    color: '$blue'
  },
  '::selection': { background: 'rgba(0, 85, 255, 0.2)' },
  '*': { boxSizing: 'inherit' },
  '.root': { minHeight: '100vh' },

  // Typography
  'b,em':{
    fontWeight: '600',
  },
  'h1,h2,h3,h4,h5,h6': {
    fontWeight: '600',
    fontStyle: 'normal',
    display: 'block',
  },
  h1: {
    fontSize: '$heading1',
    lineHeight: '$heading1',
  },
  h2: {
    fontSize: '$heading2',
    lineHeight: '$heading2',
  },
  h3: {
    fontSize: '$heading3',
    lineHeight: '$heading3',
  },
  h4: {
    fontSize: '$heading4',
    lineHeight: '$heading4',
  },
  h5: {
    fontSize: '$heading5',
    lineHeight: '$heading5',
  },
  h6: {
    fontSize: '$heading6',
    lineHeight: '$heading6',
  },
  p: {
    fontSize: '$body1',
    lineHeight: '$body1',
  },
};

export const globalStyles = globalCss(globalStylesObj);
