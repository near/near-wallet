import React from 'react';

const ChevronIcon = ({ color = '#9F9F9F' }) => {
    return (
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className='chevron-icon'>
            <path d="M1 13L7 7L1 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default ChevronIcon;