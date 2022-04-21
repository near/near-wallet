<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";

const SwapIconTwoArrows = ({ color, width, height, margin }) => {
    const stroke = color || "#000";
    const currentWidth = width || "20";
    const currentHeight = height || "20";
    const currentMargin = margin || "0px";
=======
=======
>>>>>>> 95d188d3c359b03201b06fb38769a606bf1c7c75
import React from 'react';

const SwapIconTwoArrows = ({ color, width, height, margin }) => {
    const stroke = color || '#000';
    const currentWidth = width || '20';
    const currentHeight = height || '20';
    // const currentMargin = margin || '0px';
<<<<<<< HEAD
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
=======
>>>>>>> 95d188d3c359b03201b06fb38769a606bf1c7c75
    return (
        <svg
            style={{ marginTop: margin }}
            height={currentHeight}
            viewBox="0 0 50 50"
            width={currentWidth}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                fill="none"
                fill-rule="evenodd"
                stroke={stroke}
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(1 1)"
                // style="stroke:#24272a;fill:none;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"
            >
                <path d="m9 27h27" />
                <path d="m9 36-9-9 9-9" />
                <path d="m27 9h-27" />
                <path d="m27 0 9 9-9 9" />
            </g>
        </svg>
    );
};

export default SwapIconTwoArrows;
