import { getLocation } from 'connected-react-router';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    recoverAccountSecretKey,
    refreshAccount,
    redirectTo,
    clearAccountState
} from '../../../actions/account';
import { Mixpanel } from '../../../mixpanel/index';
import AutoImport from './AutoImport';

export function AutoImportWrapper({
    secretKey,
    accountId,
    mixpanelImportType
}) {
    const dispatch = useDispatch();
    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const [recoveryFailed, setRecoveryFailed] = useState(false);
    const successUrl = URLParams.get('success_url');
    const failureUrl = URLParams.get('failure_url');

    useEffect(() => {
        handleRecoverWithSecretKey();
    }, []);

    const handleRecoverWithSecretKey = async () => {
        await Mixpanel.withTracking(`IE-SP Recovery with ${mixpanelImportType} auto`,
            async () => {
                await dispatch(recoverAccountSecretKey(secretKey, accountId, false));
                await dispatch(refreshAccount());
                dispatch(clearAccountState());

                if (successUrl) {
                    window.location.href = successUrl;
                    return;
                }

                await dispatch(redirectTo('/'));
            },
            (e) => {
                setRecoveryFailed(true);
                console.error(e);
            }
        );
    };

    const redirectToFailureUrl = () => window.location.href = failureUrl;

    return (
        <AutoImport
            accountId={accountId}
            recoveryFailed={recoveryFailed}
            onClickRecoverWithSecretKey={handleRecoverWithSecretKey}
            onCancel={failureUrl && redirectToFailureUrl}
        />
    );
}