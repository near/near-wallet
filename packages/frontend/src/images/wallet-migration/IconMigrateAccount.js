import * as React from 'react';

const IconMigrateAccount = (props) => (
  <svg
    width={61}
    height={60}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={0.5} width={60} height={60} rx={30} fill="#D6EDFF" />
    <g
      clipPath="url(#a)"
      stroke="#0072CE"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M35.5 39v-2a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v2M27.5 29a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM41.5 39v-2a4 4 0 0 0-3-3.87M34.5 21.13a4 4 0 0 1 0 7.75" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" transform="translate(18.5 18)" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default IconMigrateAccount;
