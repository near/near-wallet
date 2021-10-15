import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    switchAccount,
    getAccountBalance
} from '../../../redux/actions/account';
import {
    selectBalance,
    selectAccountsBalances,
    signedInAccountIdLocalStorage,
    selectAccount
} from '../../../redux/reducers/account';
import { selectAvailableAccounts } from '../../../redux/slices/availableAccounts';
import ConfirmLogin from './ConfirmLogin';
import SelectAccount from './SelectAccount';

export function LoginWrapper() {
    const dispatch = useDispatch();

    const [loginView, setLoginView] = useState('selectAccount');
    const [showGrantFullAccessModal, setShowGrantFullAccessModal] = useState(false);

    const account = useSelector(selectAccount);
    const signedInAccountId = useSelector(signedInAccountIdLocalStorage);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountsBalances = useSelector(selectAccountsBalances);
    const signedInAccountBalance = useSelector(selectBalance);

    //TODO: Use selector
    const appReferrer = account.url?.referrer;

    const loginAccessType = 'limitedAccess';

    if (loginView === 'selectAccount') {
        return (
            <SelectAccount
                signedInAccountId={signedInAccountId}
                availableAccounts={availableAccounts}
                accountsBalances={accountsBalances}
                onSelectAccount={(accountId) => dispatch(switchAccount({ accountId }))}
                getAccountBalance={(accountId) => dispatch(getAccountBalance(accountId))}
                signedInAccountBalance={signedInAccountBalance}
                onSignInToDifferentAccount={() => console.log('FIX: login to different account')}
                loginAccessType={loginAccessType}
                appReferrer={appReferrer}
                onClickCancel={() => console.log('FIX: Return to app')}
                onClickNext={() => setLoginView('confirmLogin')}
            />
        );
    }

    if (loginView === 'confirmLogin') {
        return (
            <ConfirmLogin
                signedInAccountId={signedInAccountId}
                onSignInToDifferentAccount={() => console.log('FIX: login to different account')}
                loginAccessType={loginAccessType}
                appReferrer={appReferrer}
                onClickCancel={() => setLoginView('selectAccount')}
                onClickConnect={() => {
                    if (loginAccessType !== 'limitedAccess') {
                        setShowGrantFullAccessModal(true);
                    }
                }}
                onClickConfirmFullAccess={() => {
                    console.log('FIX: Grant full access');
                }}
                showGrantFullAccessModal={showGrantFullAccessModal}
                onCloseGrantFullAccessModal={() => setShowGrantFullAccessModal(false)}
            />
        );
    }

}