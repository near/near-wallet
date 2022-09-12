import React from 'react';

const ReportsIcon = ({ color = '#A2A2A8' }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 3C18.3057 3 19.2086 3 19.8572 3.39654C20.138 3.56821 20.379 3.7888 20.5666 4.04572C21 4.63918 21 5.46534 21 7.11765V18.2941C21 20.5125 21 21.6217 20.2468 22.3108C19.4937 23 18.2815 23 15.8571 23H8.14286C5.71849 23 4.50631 23 3.75315 22.3108C3 21.6217 3 20.5125 3 18.2941V7.11765C3 5.46534 3 4.63918 3.43336 4.04572C3.62097 3.7888 3.86204 3.56821 4.14282 3.39654C4.79139 3 5.69426 3 7.5 3" stroke={color} strokeWidth="1.5"/>
            <path d="M8 11H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 16H13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="7.75" y="0.75" width="8.5" height="4.5" rx="1.25" stroke={color} strokeWidth="1.5"/>
        </svg>
    );
};

export default ReportsIcon;
