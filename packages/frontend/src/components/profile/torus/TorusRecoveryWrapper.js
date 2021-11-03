import OpenLogin from "@toruslabs/openlogin";
import { getED25519Key } from '@toruslabs/openlogin-ed25519';
import bs58 from 'bs58';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IS_MAINNET, TORUS_CLIENT_ID } from '../../../config';
import { selectAccountPublicKeys } from '../../../redux/slices/account';
import TorusRecovery from './TorusRecovery';

const openlogin = new OpenLogin({
    clientId: TORUS_CLIENT_ID,
    network: IS_MAINNET ? "mainnet" : "testnet"
    // Cannot handle 'default' network (NETWORK_ID)
});

export default () => {
    const [userInfo, setUserInfo] = useState();
    const [nearPubKeyFromTorus, setNearPubKeyFromTorus] = useState();

    const accountPublicKeys = useSelector(selectAccountPublicKeys);

    useEffect(() => {
        handleInitTorus();
    }, []);

    const handleInitTorus = async () => {
        await openlogin.init();
        if (openlogin.privKey) {
            const nearKeyPair = getED25519Key(openlogin.privKey);
            const nearPubKey = bs58.encode(nearKeyPair.pk);
            setNearPubKeyFromTorus(`ed25519:${nearPubKey}`);
            const userInfo = await openlogin.getUserInfo();
            setUserInfo(userInfo);
        }
    };

    console.log('Already logged in. User info: ', userInfo);
    console.log("nearPubKeyFromTorus: ", nearPubKeyFromTorus);
    console.log("accountPublicKeys: ", accountPublicKeys);

    if (accountPublicKeys.includes(nearPubKeyFromTorus)) {
        return (
            <TorusRecovery
                userInfo={userInfo}
            />
        );
    } else {
        return null;
    }
};