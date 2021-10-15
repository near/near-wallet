import { getLocation } from 'connected-react-router';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import {
    switchAccount,
    getAccountBalance,
    redirectTo,
    redirectToApp,
    allowLogin
} from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import {
    selectBalance,
    selectAccountsBalances,
    signedInAccountIdLocalStorage,
    selectAccount
} from '../../../redux/reducers/account';
import { selectAvailableAccounts } from '../../../redux/slices/availableAccounts';
import {
    LOCKUP_ACCOUNT_ID_SUFFIX,
    EXPLORER_URL
} from '../../../utils/wallet';
import ConfirmLogin from './ConfirmLogin';
import InvalidContractId from './InvalidContractId';
import SelectAccount from './SelectAccount';

export function LoginWrapper() {
    const dispatch = useDispatch();

    const [loginView, setLoginView] = useState('selectAccount');
    const [showGrantFullAccessModal, setShowGrantFullAccessModal] = useState(false);
    const [userInputValue, setUserInputValue] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const contractId = URLParams.get('contract_id');
    const publicKey = URLParams.get('public_key');
    const failureUrl = URLParams.get('failure_url');

    const invalidContractId = URLParams.get('invalidContractId');

    const account = useSelector(selectAccount);
    const signedInAccountId = useSelector(signedInAccountIdLocalStorage);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountsBalances = useSelector(selectAccountsBalances);
    const signedInAccountBalance = useSelector(selectBalance);

    // TODO: Replace with selector once PR is merged
    // https://github.com/near/near-wallet/pull/2178
    const appReferrer = account.url?.referrer;

    const requestingFullAccess = !contractId || (publicKey && contractId?.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`)) || contractId === signedInAccountId;
    const loginAccessType = requestingFullAccess ? 'fullAccess' : 'limitedAccess';

    const handleAllowLogin = async () => {
        await Mixpanel.withTracking("LOGIN",
            async () => {
                setLoggingIn(true);
                await dispatch(allowLogin());
            },
            (e) => {
                dispatch(showCustomAlert({
                    success: false,
                    messageCodeHeader: 'error',
                    errorMessage: e.message
                }));
                setLoggingIn(false);
            }
        );
    };

    if (invalidContractId) {
        return (
            <InvalidContractId
                invalidContractId={invalidContractId}
                onClickReturnToApp={() => window.location.href = failureUrl}
            />
        );
    }

    if (loginView === 'selectAccount') {
        return (
            <SelectAccount
                signedInAccountId={signedInAccountId}
                availableAccounts={availableAccounts}
                accountsBalances={accountsBalances}
                onSelectAccount={(accountId) => dispatch(switchAccount({ accountId }))}
                getAccountBalance={(accountId) => dispatch(getAccountBalance(accountId))}
                signedInAccountBalance={signedInAccountBalance}
                onSignInToDifferentAccount={() => {
                    Mixpanel.track("LOGIN Click create new account button");
                    dispatch(redirectTo('/create'));
                }}
                loginAccessType={loginAccessType}
                appReferrer={appReferrer}
                onClickCancel={() => {
                    Mixpanel.track("LOGIN Click deny button");
                    if (failureUrl) {
                        window.location.href = failureUrl;
                    } else {
                        dispatch(redirectToApp());
                    }
                }}
                onClickNext={() => {
                    setLoginView('confirmLogin');
                    window.scrollTo(0, 0);
                }}
            />
        );
    }

    if (loginView === 'confirmLogin') {
        return (
            <ConfirmLogin
                signedInAccountId={signedInAccountId}
                loginAccessType={loginAccessType}
                appReferrer={appReferrer}
                contractId={contractId}
                onClickCancel={() => setLoginView('selectAccount')}
                onClickConnect={async () => {
                    if (loginAccessType === 'fullAccess') {
                        setShowGrantFullAccessModal(true);
                        return;
                    }
                    handleAllowLogin();
                }}
                onChangeUserInputValue={(e) => setUserInputValue(e.target.value)}
                userInputValue={userInputValue}
                onClickConfirmFullAccess={() => handleAllowLogin()}
                loggingIn={loggingIn}
                showGrantFullAccessModal={showGrantFullAccessModal}
                onCloseGrantFullAccessModal={() => setShowGrantFullAccessModal(false)}
                EXPLORER_URL={EXPLORER_URL}
            />
        );
    }
}