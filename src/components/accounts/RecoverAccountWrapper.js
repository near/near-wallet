import { getLocation } from 'connected-react-router';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectIsMobile } from '../../reducers/status';
import RecoverAccount from './RecoverAccount';

export function RecoverAccountWrapper() {
    const isMobile = useSelector(selectIsMobile);
    const location = useSelector(getLocation);
    
    return (
        <RecoverAccount
            locationSearch={location.search}
            isMobile={isMobile}
        />
    );

}