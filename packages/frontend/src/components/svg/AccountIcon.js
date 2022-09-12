import React from 'react';

const AccountIcon = ({ color = '#A2A2A8' }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.9996 15.3334C14.3665 15.3334 16.2853 13.4146 16.2853 11.0477C16.2853 8.68074 14.3665 6.76196 11.9996 6.76196C9.63265 6.76196 7.71387 8.68074 7.71387 11.0477C7.71387 13.4146 9.63265 15.3334 11.9996 15.3334Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.80957 20.0952C6.38996 18.6625 7.27557 17.4592 8.36824 16.6187C9.46091 15.7782 10.718 15.3333 12 15.3333C13.2821 15.3333 14.5392 15.7782 15.6318 16.6187C16.7245 17.4592 17.6101 18.6625 18.1905 20.0952" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export default AccountIcon;
