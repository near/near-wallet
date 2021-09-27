import React from 'react';

export default ({ show, onClick }) => {
    if (show) {
        return (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
                <rect width="32" height="32" rx="16" fill="#FAFAFA" />
                <g clipPath="url(#clip09876540)">
                    <path d="M8.66667 16C8.66667 16 11.3333 10.6666 16 10.6666C20.6667 10.6666 23.3333 16 23.3333 16C23.3333 16 20.6667 21.3333 16 21.3333C11.3333 21.3333 8.66667 16 8.66667 16Z" stroke="#2B9AF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8954 14 14 14.8954 14 16C14 17.1046 14.8954 18 16 18Z" stroke="#2B9AF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip123230">
                        <rect width="16" height="16" fill="white" transform="translate(8 8)" />
                    </clipPath>
                </defs>
            </svg>

        );
    }
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <rect width="32" height="32" rx="16" fill="#FAFAFA" />
            <g clipPath="url(#clip848484840)">
                <path d="M14.6 10.8266C15.0589 10.7192 15.5287 10.6655 16 10.6666C20.6667 10.6666 23.3333 16 23.3333 16C22.9287 16.757 22.446 17.4698 21.8933 18.1266M17.4133 17.4133C17.2302 17.6098 17.0094 17.7674 16.7641 17.8767C16.5188 17.986 16.2539 18.0448 15.9854 18.0496C15.7169 18.0543 15.4501 18.0049 15.2011 17.9043C14.952 17.8037 14.7258 17.654 14.5359 17.4641C14.346 17.2742 14.1963 17.0479 14.0957 16.7989C13.9951 16.5499 13.9457 16.2831 13.9504 16.0146C13.9552 15.746 14.0139 15.4812 14.1233 15.2359C14.2326 14.9905 14.3902 14.7697 14.5867 14.5866M19.96 19.96C18.8204 20.8286 17.4327 21.3099 16 21.3333C11.3333 21.3333 8.66667 16 8.66667 16C9.49593 14.4546 10.6461 13.1044 12.04 12.04L19.96 19.96Z" stroke="#2B9AF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.66667 8.66669L23.3333 23.3334" stroke="#2B9AF4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip3123990">
                    <rect width="16" height="16" fill="white" transform="translate(8 8)" />
                </clipPath>
            </defs>
        </svg>
    );
};