import * as React from 'react';

const IconLedger = (props) => (
  <svg
    width={48}
    height={48}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <path fill="url(#a)" d="M0 0h48v48H0z" />
    <defs>
      <pattern
        id="a"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#b" transform="scale(.0025)" />
      </pattern>
      <image
        id="b"
        width={400}
        height={400}
        xlinkHref="data:image/jpeg;base64,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P7P6i6dBQRJxJON2EEEEEEEGvm3ED1hUvcAJRZastWWrLVlqy1ZaCRd4IARE05/5lmILuxl2qqqqqqshP2sEMzJ9ZfA8J8Xg+a2KNijYo2KNijYo2KNijYoc7keRhL+S3//aAAwDAQACAAMAAAAQ888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888884wwww08884wwww88888888888o4MMMM888sMMMU88888888888oo88888888888U88888888888sk88880888888Y8888888888888888oo88888888888888888888888oo88888888888888888888888oo88888888888888888888888oo88888888888888888848888osMMc888008888888888oo88888888888U88888888888oo88888888888U88888888888oo88888888888U88888888888s8888s88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888//EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQMBAT8QHH//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAECAQE/EBx//8QAKBABAAECBQMDBQEAAAAAAAAAAREhMQAwQcHwECCBQFFhUHBxgJCR/9oACAEBAAE/EP5KtfXGRGZCIWVixYsWLFixYpsow6ZgWZHeRPNgQMC2w1ysWLFixYsWLFTAo5JKUAu9LR6l+MljxaENERMhFFFFFFENW8WQYGkp/veW61RkUjaRHzkIooooooytnTKJgC9B+8K79+TXfvya79+TXfvya4tWDA25RXo2ZkMkgVEdTIaxLQwe8AsdGybuLhC4jZzWNBHmuq0OgqjQxkYWBRqJ4/bNbcW3FtxbcW3FtxbcW3FoEB2WQGITD2pkyZMuvliomFBsNPoMcYEl7oCxU6KHnMfAGERsmQpjlUFRlBNHvWLFixYsgJcRGNgUaiZCl3hR/sBV6KI2eTUoElVJEfP6Jv35Nd+/Jrv35Nd+/Jrv35Nd+iL1CU3Vi+OabY5ptjmm2OabY5ptjmm2OabYT0UMRZkLd8h7YJTqpOOb7Y5vtjm+2Ob7Y5vtjm+2Ob7YfB8/hYQp6lcPJKxrD0RGt8oiIiIiKVfmN7kadLd4tJlHgdIpu2yqqqqqqqqqvjMTzBk12Lx8/wAlv//Z"
      />
    </defs>
  </svg>
);

export default IconLedger;
