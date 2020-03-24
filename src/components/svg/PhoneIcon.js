import React from 'react';

const PhoneIcon = () => {

    const styles = {
        fill: 'none',
        stroke: '#8dd4bd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2px'
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38">
            <title>phone-icon</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <path style={styles} className="icon" d="M31.73,6.27a18,18,0,0,1,0,25.46"/>
                    <path style={styles} className="icon" d="M6.27,31.73a18,18,0,0,1,0-25.46"/>
                    <rect style={styles} className="icon" x="10" y="1" width="18" height="36"/>
                    <line style={styles} className="icon" x1="10" y1="4" x2="28" y2="4"/>
                    <line style={styles} className="icon" x1="10" y1="34" x2="28" y2="34"/>
                </g>
            </g>
        </svg>
    )
}

export default PhoneIcon;