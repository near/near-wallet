import React from 'react';

const EmailIconOne = ({ color }) => {
    return (
        <svg width="37" height="26" viewBox="0 0 37 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H36.7061V23.0002C36.7061 24.657 35.363 26.0002 33.7061 26.0002H3C1.34315 26.0002 0 24.657 0 23.0002V0Z" fill={color ? '#D6EDFF' : '#E5E5E6'}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M0 0H18.3531H36.7061L18.3531 12.6177L0 0Z" fill={color ? '#8FCDFF' : '#D5D4D8'}/>
        </svg>
    );
};

export default EmailIconOne;
