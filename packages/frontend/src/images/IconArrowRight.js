import React from 'react';

export default ({ stroke = '#ccc' }) => (
    <svg viewBox="0 0 11 20" xmlns="http://www.w3.org/2000/svg">
        <path
            d="m1 19 9-9-9-9"
            fill="none"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);
