import React from 'react';

const SwapIconTwoArrows = ({ color, width, height, margin }) => {
    // const stroke = color || '#000';
    const currentWidth = width || '20';
    const currentHeight = height || '20';
    // const currentMargin = margin || '0px';
    return (
        <svg
            style={{ marginTop: margin }}
            height={currentHeight}
            viewBox="0 0 50 50"
            width={currentWidth}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                fill={color}
                fillRule="evenodd"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(1 1)"
                // style="stroke:#24272a;fill:none;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"
            >
                <path d="m9 27h27" fill="none"/>
                <path d="m9 36-9-9 9-9" fill="none"/>
                <path d="m27 9h-27"  fill="none"/>
                <path d="m27 0 9 9-9 9" fill="none"/>
            </g>
        </svg>
    );
};

export default SwapIconTwoArrows;
