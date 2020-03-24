import React from 'react';

const PhraseIcon = () => {

    const styles = {
        fill: 'none',
        stroke: '#8dd4bd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2px'
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38">
            <title>phrase-icon</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <line style={styles} className='icon' x1="1" y1="10" x2="10" y2="10"/>
                    <line style={styles} className='icon' x1="1" y1="19" x2="10" y2="19"/>
                    <line style={styles} className='icon' x1="1" y1="37" x2="10" y2="37"/>
                    <line style={styles} className='icon' x1="19" y1="19" x2="28" y2="19"/>
                    <line style={styles} className='icon' x1="19" y1="28" x2="28" y2="28"/>
                    <line style={styles} className='icon' x1="1" y1="28" x2="10" y2="28"/>
                    <line style={styles} className='icon' x1="19" y1="37" x2="28" y2="37"/>
                    <polyline style={styles} className='icon' points="1 1 28 1 28 10 37 10 37 37"/>
                    <line style={styles} className='icon' x1="28" y1="1" x2="37" y2="10"/>
                </g>
            </g>
        </svg>
    )
}

export default PhraseIcon;