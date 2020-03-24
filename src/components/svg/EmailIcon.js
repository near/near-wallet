import React from 'react';

const EmailIcon = () => {
    
    const styles = {
        fill: 'none',
        stroke: '#8dd4bd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2px'
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38">
            <title>email-icon</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <path style={styles} className='icon' d="M19,37A18,18,0,1,1,37,19"/>
                    <circle style={styles} className='icon' cx="19" cy="19" r="9"/>
                    <path style={styles} className='icon' d="M37,19v4.5A4.49,4.49,0,0,1,32.5,28h0A4.49,4.49,0,0,1,28,23.5V19"/>
                </g>
            </g>
        </svg>
    )
}

export default EmailIcon;