import React, { FC } from 'react';

const FailIcon: FC = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none">
            <circle cx="30" cy="30" r="30" fill="var(--color-error)" />
            <path fill="#fff" d="M42.197 42.199a2.25 2.25 0 0 0 0-3.182L33.18 30l9.016-9.016a2.25 2.25 0 0 0-3.182-3.182l-9.016 9.016-9.015-9.016a2.25 2.25 0 1 0-3.183 3.182l9.016 9.016-9.015 9.015a2.25 2.25 0 0 0 3.182 3.182l9.015-9.015 9.016 9.016a2.25 2.25 0 0 0 3.182 0Z" />
        </svg>
    );
};

export default FailIcon;
