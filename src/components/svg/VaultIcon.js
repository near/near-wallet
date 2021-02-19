import React from 'react';

const VaultIcon = ({ color = '#A2A2A8' }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0)">
                <path d="M2 17V3C2 1.89543 2.89543 1 4 1H20C21.1046 1 22 1.89543 22 3V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17Z" stroke={color} strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
                <line x1="12" y1="5" x2="12" y2="6.28408" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <line x1="17" y1="10" x2="16" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="14" x2="12" y2="15.2841" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <line x1="8.28408" y1="10" x2="7" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="23" x2="9" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <line x1="15" y1="23" x2="18" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            </g>
            <defs>
                <clipPath id="clip0">
                    <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    )
}

export default VaultIcon;
