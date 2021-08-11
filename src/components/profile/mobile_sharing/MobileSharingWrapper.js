import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { wallet } from '../../../utils/wallet';
import MobileSharing from './MobileSharing';

const MobileSharingWrapper = () => {
    const location = useLocation();
    const { accountId } = useSelector(({ account }) => account);
    const [mobileSharingLink, setMobileSharingLink] = useState('');

    useEffect(() => {
        async function getLocalSecretKey() {
            const localSecretKey = accountId && await wallet.getLocalSecretKey(accountId);
            setMobileSharingLink(`${window.location.protocol}//${window.location.host}/auto-import-secret-key#${accountId}/${localSecretKey}`);
        }
        getLocalSecretKey();
    }, [accountId, location]);

    return (
        <MobileSharing
            mobileSharingLink={mobileSharingLink}
        />
    );
};

export default MobileSharingWrapper;