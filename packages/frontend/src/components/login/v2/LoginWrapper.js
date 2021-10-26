import { getLocation } from 'connected-react-router';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import {
    switchAccount,
    getAccountBalance,
    redirectTo,
    redirectToApp
} from '../../../redux/actions/account';
import {
    selectAccountUrlReferrer,
    selectAccountLocalStorageAccountId,
    selectAccountAccountsBalances,
    selectBalance
} from '../../../redux/slices/account';
import { selectAvailableAccounts } from '../../../redux/slices/availableAccounts';
import { LOCKUP_ACCOUNT_ID_SUFFIX } from '../../../utils/wallet';
import ConfirmLoginWrapper from './ConfirmLoginWrapper';
import InvalidContractId from './InvalidContractId';
import SelectAccountLogin from './SelectAccountLogin';

export const LOGIN_ACCESS_TYPES = {
    FULL_ACCESS: 'fullAccess',
    LIMITED_ACCESS: 'limitedAccess'
};

export function LoginWrapper() {
    const dispatch = useDispatch();

    const [confirmLogin, setConfirmLogin] = useState(true);

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const contractId = URLParams.get('contract_id');
    const publicKey = URLParams.get('public_key');
    const failureUrl = URLParams.get('failure_url');
    const invalidContractId = URLParams.get('invalidContractId');

    const signedInAccountId = useSelector(selectAccountLocalStorageAccountId);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountsBalances = useSelector(selectAccountAccountsBalances);
    const appReferrer = useSelector(selectAccountUrlReferrer);

    const requestingFullAccess = !contractId || (publicKey && contractId?.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`)) || contractId === signedInAccountId;
    const loginAccessType = requestingFullAccess ? LOGIN_ACCESS_TYPES.FULL_ACCESS : LOGIN_ACCESS_TYPES.LIMITED_ACCESS;

    if (invalidContractId) {
        return (
            <InvalidContractId
                invalidContractId={invalidContractId}
                onClickReturnToApp={() => {
                    Mixpanel.track("LOGIN Invalid contract id Click return to app button", { contract_id: contractId });
                    window.location.href = failureUrl;
                }}
            />
        );
    }

    if (confirmLogin) {
        return (
            <ConfirmLoginWrapper
                signedInAccountId={signedInAccountId}
                loginAccessType={loginAccessType}
                appReferrer={appReferrer}
                contractId={contractId}
                onClickCancel={() => setConfirmLogin(false)}
            />
        );
    }

    return (
        <SelectAccountLogin
            signedInAccountId={signedInAccountId}
            availableAccounts={availableAccounts}
            accountsBalances={accountsBalances}
            onSelectAccount={(accountId) => dispatch(switchAccount({ accountId }))}
            getAccountBalance={(accountId) => dispatch(getAccountBalance(accountId))}
            onSignInToDifferentAccount={() => {
                Mixpanel.track("LOGIN Click recover different account button");
                dispatch(redirectTo('/recover-account'));
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
                setConfirmLogin(true);
                window.scrollTo(0, 0);
            }}
        />
    );
}