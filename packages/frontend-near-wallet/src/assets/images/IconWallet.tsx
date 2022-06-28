import * as React from 'react';

const IconWallet = (props) => (
    <svg
        width={61}
        height={60}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect x={0.5} width={60} height={60} rx={30} fill="#D6EDFF" />
        <path
            d="M40.5 20h-16a4 4 0 0 0-4 4m4 0h16m-20 0a4 4 0 0 0 4 4h16v12h-17a3 3 0 0 1-3-3V24Z"
            stroke="#0072CE"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default IconWallet;