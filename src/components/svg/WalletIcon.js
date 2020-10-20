import React from 'react';

const WalletIcon = ({ color = '#D4D3D9' }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2H6C3.79086 2 2 3.79086 2 6M6 6H22M2 6C2 8.20914 3.79086 10 6 10H22V22H5C3.34315 22 2 20.6569 2 19V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default WalletIcon;
