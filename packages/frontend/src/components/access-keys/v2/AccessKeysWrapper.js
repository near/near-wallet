import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccessKeys, removeAccessKey } from '../../../redux/actions/account';
import { selectAccount } from '../../../redux/reducers/account';
import AuthorizedAppsKeys from './AuthorizedAppsKeys';
import FullAccessKeys from './FullAccessKeys';

export default ({ type }) => {
    const dispatch = useDispatch();

    const [showManageKeyModal, setShowManageKeyModal] = useState(false);
    const [accessKeyData, setAccessKeyData] = useState();
    const [deAuthorizingKey, setDeAuthorizingKey] = useState();

    const account = useSelector(selectAccount);
    const fullAccessKeys = account.fullAccessKeys;
    const authorizedAppsKeys = account.authorizedApps;

    const deAuthorizeKey = async (publicKey) => {
        setDeAuthorizingKey(publicKey);
        try {
            await dispatch(removeAccessKey(publicKey));
            await dispatch(getAccessKeys());
        } finally {
            setDeAuthorizingKey(false);
        }
    };

    if (type === 'authorized-apps') {
        return (
            <AuthorizedAppsKeys
                authorizedAppsKeys={authorizedAppsKeys}
                onClick={(appKeyData) => deAuthorizeKey(appKeyData.public_key)}
                deAuthorizingKey={deAuthorizingKey}
            />
        );
    }

    if (type === 'full-access-keys') {
        return (
            <FullAccessKeys
                fullAccessKeys={fullAccessKeys}
                onClick={(accessKeyData) => {
                    setShowManageKeyModal(true);
                    setAccessKeyData(accessKeyData);
                }}
            />
        );
    }
};