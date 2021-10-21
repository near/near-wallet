import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccessKeys, removeAccessKey } from '../../../redux/actions/account';
import { selectAccountSlice, selectAccountId } from '../../../redux/slices/account';
import AuthorizedAppsKeys from './AuthorizedAppsKeys';
import FullAccessKeys from './FullAccessKeys';

export default ({ type }) => {
    const dispatch = useDispatch();

    const [userInputAccountId, setUserInputAccountId] = useState('');
    const [deAuthorizingKey, setDeAuthorizingKey] = useState('');
    const [confirmDeAuthorizeKey, setConfirmDeAuthorizeKey] = useState('');

    const account = useSelector(selectAccountSlice);
    const accountId = useSelector(selectAccountId);

    // TODO: Use selectors once PR is merged to master:
    // https://github.com/near/near-wallet/pull/2178
    const fullAccessKeys = account.fullAccessKeys;
    const authorizedAppsKeys = account.authorizedApps;

    const deAuthorizeKey = async (publicKey) => {
        setDeAuthorizingKey(publicKey);
        try {
            await dispatch(removeAccessKey(publicKey));
            await dispatch(getAccessKeys());
        } finally {
            setDeAuthorizingKey('');
        }
    };

    if (type === 'authorized-apps') {
        return (
            <AuthorizedAppsKeys
                authorizedAppsKeys={authorizedAppsKeys}
                onClickDeAuthorizeKey={(publicKey) => deAuthorizeKey(publicKey)}
                deAuthorizingKey={deAuthorizingKey}
            />
        );
    }

    if (type === 'full-access-keys') {
        return (
            <FullAccessKeys
                fullAccessKeys={fullAccessKeys}
                onClickDeAuthorizeKey={(publicKey) => deAuthorizeKey(publicKey)}
                userInputAccountId={userInputAccountId}
                setUserInputAccountId={(userInputAccountId) => setUserInputAccountId(userInputAccountId)}
                accountId={accountId}
                confirmDeAuthorizeKey={confirmDeAuthorizeKey}
                setConfirmDeAuthorizeKey={(publicKey) => setConfirmDeAuthorizeKey(publicKey)}
                deAuthorizingKey={deAuthorizingKey}
            />
        );
    }
};