import React from 'react';

type LedgerImageCircleProps = {
    color?: string;
}

export default ({ color = '#C8F6E0' }:LedgerImageCircleProps) => (
    <svg width="183" height="111" viewBox="0 0 183 111" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="116.5" cy="59.5" r="51.5" fill={color}/>
        <rect x="49.1238" y="48.6239" width="85.2284" height="24.5851" rx="2" fill="#3E3E3E"/>
        <rect x="59.5042" y="54.0873" width="40.4288" height="13.6584" rx="2" fill="#0E0E0E"/>
        <path d="M38.1973 57.1799C38.1973 56.0754 39.0927 55.1799 40.1973 55.1799H49.124V66.653H40.1973C39.0927 66.653 38.1973 65.7576 38.1973 64.653V57.1799Z" fill="#0E0E0E"/>
        <path d="M59.5042 48.4386C59.5042 47.334 60.3996 46.4386 61.5042 46.4386H68.4309C69.5354 46.4386 70.4309 47.334 70.4309 48.4386V48.6239H59.5042V48.4386Z" fill="#0E0E0E"/>
        <path d="M89.0063 48.4386C89.0063 47.334 89.9018 46.4386 91.0063 46.4386H97.9331C99.0376 46.4386 99.9331 47.334 99.9331 48.4386V48.6239H89.0063V48.4386Z" fill="#0E0E0E"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M113.542 51.5734C108.742 56.374 108.742 64.1572 113.542 68.9577C118.343 73.7583 126.126 73.7582 130.927 68.9577L181.086 18.7985C181.867 18.0175 181.867 16.7511 181.086 15.9701L166.53 1.41422C165.749 0.633171 164.482 0.633177 163.701 1.41423L113.542 51.5734ZM127.45 64.7082C130.117 62.0413 130.117 57.7172 127.45 55.0503C124.783 52.3833 120.459 52.3833 117.792 55.0503C115.125 57.7172 115.125 62.0413 117.792 64.7082C120.459 67.3752 124.783 67.3752 127.45 64.7082Z" fill="#DDDDDD"/>
        <circle cx="122.621" cy="59.8792" r="6.42187" transform="rotate(-45 122.621 59.8792)" fill="#C8F6E0" stroke="#313131" strokeWidth="3"/>
        <rect x="0.5" y="60.097" width="37.6972" height="1.63901" fill="url(#paint0_linear_343_483)"/>
        <defs>
        <linearGradient id="paint0_linear_343_483" x1="38.1972" y1="60.9164" x2="0.773169" y2="60.9164" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0E0E0E"/>
        <stop offset="1" stopColor="#0E0E0E" stopOpacity="0"/>
        </linearGradient>
        </defs>
    </svg>
);
