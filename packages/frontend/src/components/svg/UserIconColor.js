import React from 'react';

export default ({ color }) => {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill={color ? "#8FCDFF" : "#F0F0F1"} />
            <circle cx="18" cy="17.7307" r="5" stroke={color ? "#2B9AF4" : "#D5D4D8"} strokeWidth="2" />
            <path d="M18 27.7307C14.3001 27.7307 11.0681 25.7218 9.33763 22.7307H26.6624C24.9319 25.7218 21.6999 27.7307 18 27.7307Z" stroke={color ? "#2B9AF4" : "#D5D4D8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 17.7307C28 12.2079 23.5228 7.73071 18 7.73071C12.4772 7.73071 8 12.2079 8 17.7307" stroke={color ? "#2B9AF4" : "#D5D4D8"} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};