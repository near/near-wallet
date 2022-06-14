import * as React from 'react';

const IconSecurityLock = (props) => (
  <svg
    width={61}
    height={60}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={0.5} width={60} height={60} rx={30} fill="#D6EDFF" />
    <path
      d="M37.5 29h-14a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM25.5 29v-4a5 5 0 1 1 10 0v4"
      stroke="#0072CE"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default IconSecurityLock;
