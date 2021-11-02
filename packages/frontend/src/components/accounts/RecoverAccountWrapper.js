import OpenLogin from "@toruslabs/openlogin";
import { getLocation } from 'connected-react-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IS_MAINNET } from '../../config';
import {
    redirectTo,
    refreshAccount
} from '../../redux/actions/account';
import isMobile from '../../utils/isMobile';
import { wallet } from '../../utils/wallet';
import RecoverAccount from './RecoverAccount';

const openlogin = new OpenLogin({
    clientId: "BFmAhi0-B_8HRR7DgsqAc_vzu1JAJ0_vjNlqGHsS-F0sQEPdKoXayu77U1LvyRa8KLooMUM-f1Q9LmHDePUsOWs",
    network: IS_MAINNET ? "mainnet" : "testnet",
    uxMode: "popup"
});

export function RecoverAccountWrapper() {
    const dispatch = useDispatch();
    const location = useSelector(getLocation);

    useEffect(() => {
        const initTorus = async () => {
            await openlogin.init();
        };
        initTorus();
    }, []);

    return (
        <RecoverAccount
            locationSearch={location.search}
            isMobile={isMobile()}
            onLoginWithTorus={async () => {
                await openlogin.login();
                await wallet.recoverAllAccountsWithTorusSecretKey(openlogin.privKey);
                await dispatch(refreshAccount());
                dispatch(redirectTo('/'));
            }}
        />
    );
}