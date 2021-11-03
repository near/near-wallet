import OpenLogin from "@toruslabs/openlogin";
import { getLocation } from 'connected-react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IS_MAINNET, TORUS_CLIENT_ID } from '../../config';
import {
    redirectTo,
    refreshAccount
} from '../../redux/actions/account';
import isMobile from '../../utils/isMobile';
import { wallet } from '../../utils/wallet';
import RecoverAccount from './RecoverAccount';

const openlogin = new OpenLogin({
    clientId: TORUS_CLIENT_ID,
    network: IS_MAINNET ? "mainnet" : "testnet",
    uxMode: "popup"
});

export function RecoverAccountWrapper() {
    const dispatch = useDispatch();
    const location = useSelector(getLocation);

    return (
        <RecoverAccount
            locationSearch={location.search}
            isMobile={isMobile()}
            onLoginWithTorus={async () => {
                await openlogin.init();
                await openlogin.login();
                await wallet.recoverAllAccountsWithTorusSecretKey(openlogin.privKey);
                await dispatch(refreshAccount());
                dispatch(redirectTo('/'));
            }}
        />
    );
}