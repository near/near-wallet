import React from 'react';

export default ({ stroke = '#ccc' }) => (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <g
            fill="none"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        >
            <path d="m1 1 18 18" />
            <path d="m19 1-18 18" />
        </g>
    </svg>
);
