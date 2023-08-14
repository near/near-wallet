import React from 'react';

const CloseIcon = ({ color, className }) => {
    const stroke = color || '#ccc';
    return (
        <svg className={className} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke={stroke} stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m1 1 18 18"/><path d="m19 1-18 18"/></g></svg>
    );
};

export default CloseIcon;


