import React from 'react';

const PhoneIconOne = ({ color }) => {
    return (
        <svg width="25" height="42" viewBox="0 0 25 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="25" height="41.9355" rx="3" fill={color ? "#8FCDFF" : "#E5E5E6"}/>
            <rect x="2.41936" y="2.41943" width="20.1613" height="30.6452" rx="3" fill={color ? "#D6EDFF" : "#FAFAFA"}/>
            <circle cx="12.5" cy="37.5" r="2.01613" fill={color ? "#49AEFF" : "#D5D4D8"}/>
        </svg>
    )
}

export default PhoneIconOne;