import React from 'react';

const AlertRoundedIcon = ({ color }) => {
    const stroke = color || '#EF860D'
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.33333V7.99999M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8.00001 14.6667C4.31811 14.6667 1.33334 11.6819 1.33334 8C1.33334 4.3181 4.31811 1.33333 8.00001 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default AlertRoundedIcon;