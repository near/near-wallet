import React from 'react';

type PassPhraseIconProps = {
    color?:boolean;
}

const PassPhraseIcon = ({ color }:PassPhraseIconProps) => {
    const rectColor = color ? '#49AEFF' : '#A2A2A8';
    return (
        <svg width="33" height="43" viewBox="0 0 33 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 1.34314 1.34315 0 3 0H22.6742C23.5424 0 24.3681 0.376158 24.9378 1.03129L31.3182 8.36763C31.793 8.9136 32.0545 9.61278 32.0545 10.3363V40C32.0545 41.6569 30.7114 43 29.0545 43H3C1.34314 43 0 41.6569 0 40V3Z" fill={color ? '#D6EDFF' : '#E5E5E6'}/>
            <rect x="2.84926" y="11.7273" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="2.84926" y="17.2" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="2.84926" y="22.6727" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="9.97256" y="11.7273" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="9.97256" y="17.2" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="9.97256" y="22.6727" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="17.0958" y="11.7273" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="17.0958" y="17.2" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="17.0958" y="22.6727" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="24.219" y="11.7273" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="24.219" y="17.2" width="4.98626" height="2.34545" fill={rectColor}/>
            <rect x="24.219" y="22.6727" width="4.98626" height="2.34545" fill={rectColor}/>
        </svg>
    );
};

export default PassPhraseIcon;
