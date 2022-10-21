import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import AlertTriangleIcon from '../../../components/svg/AlertTriangleIcon';
import { NOTIFICATION_TYPE } from '../utils/constants';

const NotificationWrapper = styled.p`
    width: 100%;
    margin: 0.4rem 0 0;
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

const Notification = ({ content }) => {
    const { id, type, data } = content;
    const triangleColor = type === NOTIFICATION_TYPE.error ? 'var(--color-error)' : '';

    return (
        <NotificationWrapper className={`${type}`}>
            <IconWrapper>
                <AlertTriangleIcon color={triangleColor} />
            </IconWrapper>
            <span>
                <Translate id={id} data={data} />
            </span>
        </NotificationWrapper>
    );
};

export default Notification;
