import React from 'react';

type CoinDepositIconProps = {
    color: boolean;
}

export default ({ color }:CoinDepositIconProps) => (
    <svg width="33" height="37" viewBox="0 0 33 37" fill="none" xmlns="http://www.w3.org/2000/svg" className='coin-deposit-icon'>
        {/*//@ts-ignore */}
        <mask id="mask0232323" masktype="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="33" height="37">
            <rect width="33" height="37" transform="matrix(-1 0 0 1 33 0)" fill="#F0F9FF" />
        </mask>
        <g mask="url(#mask0232323)">
            <rect x="-0.078125" width="4.44079" height="37.5" rx="2.22039" fill={color ? '#2B9AF4' : '#A2A2A8'} />
            <path d="M9.78786 31.8394C17.0165 31.8394 22.8765 25.9794 22.8765 18.7508C22.8765 11.5221 17.0165 5.66211 9.78786 5.66211C2.5592 5.66211 -3.30078 11.5221 -3.30078 18.7508C-3.30078 25.9794 2.5592 31.8394 9.78786 31.8394Z" fill={color ? '#8FCDFF' : '#E5E5E6'} />
            <path d="M27.3047 18.5029L32.7323 13.8154V23.1904L27.3047 18.5029Z" fill={color ? '#2B9AF4' : '#A2A2A8'} />
        </g>
    </svg>
);
