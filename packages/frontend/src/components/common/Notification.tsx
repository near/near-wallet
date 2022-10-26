import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import AlertTriangleIcon from '../svg/AlertTriangleIcon';

const NotificationWrapper = styled.p`
    width: 100%;
    margin: 0;
    padding: 0.75rem;
    display: flex;
    font-size: 1.1rem;
    border-radius: 0.5rem;

    &.warning {
        color: var(--color-warning);
        background-color: var(--color-warning-background);
    }

    &.error {
        color: var(--color-error);
        background-color: var(--color-error-background);
    }

    span {
        margin-left: 0.6rem;
    }
`;

const IconWrapper = styled.span`
    padding: 0.1rem;
`;

const Notification: FC<{
    type?: string,
    children: ReactNode,
}> = ({ type, children }) => {
    const triangleColor = type === 'error' ? 'var(--color-error)' : '';

    return (
        <NotificationWrapper className={`${type}`}>
            <IconWrapper>
                <AlertTriangleIcon color={triangleColor} />
            </IconWrapper>
            <span>{children}</span>
        </NotificationWrapper>
    );
};

export default Notification;
