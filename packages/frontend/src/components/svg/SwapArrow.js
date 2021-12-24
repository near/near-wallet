import React from 'react';

const SwapArrow = ({ color }) => {
    const svgColor = color || '#72727A';
    return (
        <svg width="24" height="24" viewBox="0 0 16 22" fill={svgColor} xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21.5V22H4V21.5H3ZM3.5 0.5L0.613249 5.5H6.38675L3.5 0.5ZM4 21.5V5H3V21.5H4Z" stroke={svgColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 0.5V0H13.5V0.5H12.5ZM13 21.5L10.1132 16.5H15.8868L13 21.5ZM13.5 0.5V17H12.5V0.5H13.5Z" stroke={svgColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg >

    );
};

export default SwapArrow;