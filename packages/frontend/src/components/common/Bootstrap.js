import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions as securityActions } from '../../redux/slices/security';

const { initializeBlacklistedTokens } = securityActions;

export default function Bootstrap() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeBlacklistedTokens());
    }, []);

    return null;
};
