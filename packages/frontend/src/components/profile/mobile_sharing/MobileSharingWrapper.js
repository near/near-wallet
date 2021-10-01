import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectAccountId } from '../../../redux/slices/account';
import { wallet } from '../../../utils/wallet';
import MobileSharing from './MobileSharing';

const MobileSharingWrapper = () => {
    const accountId = useSelector(selectAccountId);
    const [mobileSharingLink, setMobileSharingLink] = useState('');

    useEffect(() => {
        async function updateMobileSharingLink() {
            const localSecretKey = accountId && await wallet.getLocalSecretKey(accountId);
            setMobileSharingLink(`${window.location.protocol}//${window.location.host}/auto-import-secret-key#${accountId}/${encodeURIComponent(localSecretKey)}`);
        }
        updateMobileSharingLink();
    }, [accountId]);

    return (
        <MobileSharing
            mobileSharingLink={mobileSharingLink}
        />
    );
};

export default MobileSharingWrapper;