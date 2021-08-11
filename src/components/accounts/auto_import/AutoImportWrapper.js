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

export function AutoImportWrapper({ secretKey, accountId, mixpanelImportType }) {
    const dispatch = useDispatch();
    const { location } = useSelector(({ router }) => router);
    const [recovering, setRecovering] = useState(false);
    const successUrl = location.query.success_url;
    const failureUrl = location.query.failure_url;

    useEffect(() => {
        recoverWithSecretKey();
    }, []);

    const recoverWithSecretKey = async () => {
        await Mixpanel.withTracking(`IE-SP Recovery with ${mixpanelImportType} auto`,
            async () => {
                setRecovering(true);
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
                setRecovering('failed');
                console.error(e);
            }
        );
    };

    return (
        <AutoImport
            accountId={accountId}
            recovering={recovering}
            failureUrl={failureUrl}
            recoverWithSecretKey={recoverWithSecretKey}
        />
    );
}