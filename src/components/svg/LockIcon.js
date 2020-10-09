import React from 'react';

const LockIcon = (props) => {

    const color = props.color || '#008D6A'

    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6667 7.83331H3.33333C2.59695 7.83331 2 8.43027 2 9.16665V13.8333C2 14.5697 2.59695 15.1666 3.33333 15.1666H12.6667C13.403 15.1666 14 14.5697 14 13.8333V9.16665C14 8.43027 13.403 7.83331 12.6667 7.83331Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.66669 7.83331V5.16665C4.66669 4.28259 5.01788 3.43475 5.643 2.80962C6.26812 2.1845 7.11597 1.83331 8.00002 1.83331C8.88408 1.83331 9.73192 2.1845 10.357 2.80962C10.9822 3.43475 11.3334 4.28259 11.3334 5.16665V7.83331" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    )
}

export default LockIcon;