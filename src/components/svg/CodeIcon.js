import React from 'react';

const CodeIcon = ({ color = '#FFB259' }) => {
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 18.3501L22 12.3501L16 6.3501" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6.3501L2 12.3501L8 18.3501" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default CodeIcon;