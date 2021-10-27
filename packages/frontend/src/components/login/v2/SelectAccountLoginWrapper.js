import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import {
    switchAccount,
    getAccountBalance,
    redirectTo,
    redirectToApp
} from '../../../redux/actions/account';
import {
    selectAccountLocalStorageAccountId,
    selectAccountUrlReferrer,
    selectAccountAccountsBalances
} from '../../../redux/slices/account';
import { selectAvailableAccounts } from '../../../redux/slices/availableAccounts';
import SelectAccountLogin from './SelectAccountLogin';

export default ({
    loginAccessType,
    onClickNext,
    failureUrl
}) => {

    const dispatch = useDispatch();

    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountAccountsBalances = useSelector(selectAccountAccountsBalances);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);

    return (
        <SelectAccountLogin
            signedInAccountId={accountLocalStorageAccountId}
            availableAccounts={availableAccounts}
            accountsBalances={accountAccountsBalances}
            onSelectAccount={(accountId) => dispatch(switchAccount({ accountId }))}
            getAccountBalance={(accountId) => dispatch(getAccountBalance(accountId))}
            onSignInToDifferentAccount={() => {
                Mixpanel.track("LOGIN Click recover different account button");
                dispatch(redirectTo('/recover-account'));
            }}
            loginAccessType={loginAccessType}
            appReferrer={accountUrlReferrer}
            onClickCancel={() => {
                Mixpanel.track("LOGIN Click deny button");
                if (failureUrl) {
                    window.location.href = failureUrl;
                } else {
                    dispatch(redirectToApp());
                }
            }}
            onClickNext={onClickNext}
        />
    );
};