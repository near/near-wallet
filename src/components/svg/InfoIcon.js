import React from 'react';

const InfoIcon = (props) => {

    const color = props.color || '#4A4F54'

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='info-icon'>
            <circle cx="12" cy="12" r="11.25" stroke={color} strokeWidth="1.5"/>
                <line x1="12" y1="9.5" x2="12" y2="18.5" stroke={color} strokeWidth="1.5"/>
            <circle cx="12" cy="7" r="1" fill={color}/>
        </svg>
    )
}

export default InfoIcon;