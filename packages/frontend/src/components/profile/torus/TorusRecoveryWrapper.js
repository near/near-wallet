import OpenLogin from "@toruslabs/openlogin";
import { getED25519Key } from '@toruslabs/openlogin-ed25519';
import bs58 from 'bs58';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IS_MAINNET } from '../../../config';
import { selectAccountPublicKeys } from '../../../redux/slices/account';
import TorusRecovery from './TorusRecovery';

const openlogin = new OpenLogin({
    clientId: "BFmAhi0-B_8HRR7DgsqAc_vzu1JAJ0_vjNlqGHsS-F0sQEPdKoXayu77U1LvyRa8KLooMUM-f1Q9LmHDePUsOWs",
    network: IS_MAINNET ? "mainnet" : "testnet" // Cannot handle 'default' network for now (NETWORK_ID)
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
            console.log("Already logged in. UserInfo: ", userInfo);
            setUserInfo(userInfo);
        }
    };

    console.log("userInfo: ", userInfo);
    console.log("nearPubKeyFromTorus: ", nearPubKeyFromTorus);
    console.log("accountPublicKeys: ", accountPublicKeys);

    if (accountPublicKeys.includes(nearPubKeyFromTorus)) {
        return (
            <TorusRecovery
                onClick={async () => {
                    if (openlogin.privKey) {
                        console.log('log out');
                        await openlogin.logout();
                        setUserInfo(null);
                    } else {
                        await openlogin.login();
                        handleInitTorus();
                    }
                }}
                userInfo={userInfo}
            />
        );
    } else {
        return null;
    }
};