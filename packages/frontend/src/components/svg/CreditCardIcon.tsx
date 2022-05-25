import React from 'react';

type CreditCardIconProps = {
    color?:boolean;
}

export default ({ color }:CreditCardIconProps) => (
    <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='credit-card-icon'>
        <rect width="36" height="24" rx="4" fill={color ? '#8FCDFF' : '#E5E5E6'} />
        <rect y="4" width="36" height="4" fill={color ? '#2B9AF4' : '#A2A2A8'} />
        <circle cx="5" cy="19" r="2" fill={color ? '#F0F9FF' : '#F0F9FF'} />
        <circle cx="8" cy="19" r="2" fill={color ? '#2B9AF4' : '#A2A2A8'} />
    </svg>
);
