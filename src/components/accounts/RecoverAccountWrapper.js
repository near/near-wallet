import React from 'react';
import { useSelector } from 'react-redux';

import RecoverAccount from './RecoverAccount';

export function RecoverAccountWrapper() {
    const { location } = useSelector(({ router }) => router);
    const { isMobile } = useSelector(({ status }) => status);
    return (
        <RecoverAccount
            locationSearch={location.search}
            isMobile={isMobile}
        />
    );

}