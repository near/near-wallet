import { getLocation } from 'connected-react-router';
import { parse } from 'query-string';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import {
    recoverAccountSecretKey,
    refreshAccount,
    redirectTo,
    clearAccountState
} from '../../../redux/actions/account';
import { checkIsValidUrl } from '../../../utils/helper-api';
import AutoImport from './AutoImport';


export function AutoImportWrapper({
    secretKey,
    accountId,
    mixpanelImportType
}) {
    const dispatch = useDispatch();
    const location = useSelector(getLocation);
    const URLParams = parse(location.search);
    const [recoveryFailed, setRecoveryFailed] = useState(false);
    const successUrl = checkIsValidUrl(URLParams.success_url) ? URLParams.success_url : null;
    const failureUrl = checkIsValidUrl(URLParams.failure_url) ? URLParams.failure_url : null;

    useEffect(() => {
        handleRecoverWithSecretKey();
    }, []);

    const handleRecoverWithSecretKey = async () => {
        await Mixpanel.withTracking(`IE-SP Recovery with ${mixpanelImportType} auto`,
            async () => {
                await dispatch(recoverAccountSecretKey(secretKey, accountId, false));
                await dispatch(refreshAccount());
                dispatch(clearAccountState());

                if (successUrl && checkIsValidUrl(successUrl)) {
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

    const redirectToFailureUrl = () => {
        if (checkIsValidUrl(window.location.href)) {
            window.location.href = failureUrl;
        }
    };

    return (
        <AutoImport
            accountId={accountId}
            recoveryFailed={recoveryFailed}
            onClickRecoverWithSecretKey={handleRecoverWithSecretKey}
            onCancel={failureUrl && redirectToFailureUrl}
        />
    );
}