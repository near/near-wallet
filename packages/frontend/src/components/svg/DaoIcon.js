import React from 'react';

const DaoIcon = ({ color = '#A2A2A8' }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C12 22 16.4444 18.6667 16.4444 12C16.4444 5.33333 12 2 12 2M12 22C12 22 7.55556 18.6667 7.55556 12C7.55556 5.33333 12 2 12 2M2 12C2 6.47715 6.47715 2 12 2" stroke={color} strokeWidth="1.5"/>
        </svg>
    );
};

export default DaoIcon;
