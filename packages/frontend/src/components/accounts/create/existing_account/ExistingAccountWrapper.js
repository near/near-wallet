import { getLocation } from 'connected-react-router';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../../mixpanel';
import {
    switchAccount,
    getAccountBalance,
    redirectTo
} from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import {
    selectBalance,
    selectAccountsBalances
} from '../../../../redux/reducers/account';
import { MIN_BALANCE_TO_CREATE, LINKDROP_GAS, wallet } from '../../../../utils/wallet';
import FundNewAccount from './FundNewAccount';
import SelectAccount from './SelectAccount';

export function ExistingAccountWrapper({ history }) {
    const dispatch = useDispatch();

    const [fundingAccountId, setFundingAccountId] = useState('');
    const [creatingNewAccount, setCreatingNewAccount] = useState(false);

    const account = useSelector(({ account }) => account);
    const signedInAccountId = account.localStorage?.accountId;
    const availableAccounts = useSelector(({ availableAccounts }) => availableAccounts);
    const accountsBalances = useSelector(selectAccountsBalances);
    const signedInAccountBalance = useSelector(selectBalance);

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const accountId = URLParams.get('accountId');
    const implicitAccountId = URLParams.get('implicitAccountId');
    const recoveryMethod = URLParams.get('recoveryMethod');
    const hasAllRequiredParams = !!accountId && !!implicitAccountId && !!recoveryMethod;

    if (fundingAccountId) {
        return (
            <FundNewAccount
                onClickPrimary={async () => {
                    await Mixpanel.withTracking("CA Create account from existing account",
                        async () => {
                            setCreatingNewAccount(true);
                            await wallet.createNewAccountWithCurrentActiveAccount({
                                newAccountId: accountId,
                                implicitAccountId,
                                newInitialBalance: MIN_BALANCE_TO_CREATE,
                                recoveryMethod
                            });
                        },
                        (e) => {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.createNewAccount.error',
                                errorMessage: e.message
                            }));
                            setCreatingNewAccount(false);
                            throw e;
                        }
                    );
                    dispatch(redirectTo('/'));
                }}
                onClickSecondary={() => setFundingAccountId('')}
                transferAmount={MIN_BALANCE_TO_CREATE}
                gasFeeAmount={LINKDROP_GAS}
                sender={signedInAccountId}
                receiver={accountId}
                creatingNewAccount={creatingNewAccount}
                hasAllRequiredParams={hasAllRequiredParams}
            />
        );
    }

    return (
        <SelectAccount
            signedInAccountId={signedInAccountId}
            signedInAccountAvailableBalance={signedInAccountBalance?.balanceAvailable}
            availableAccounts={availableAccounts}
            accountsBalances={accountsBalances}
            getAccountBalance={(accountId) => dispatch(getAccountBalance(accountId))}
            onSelectAccount={(accountId) => dispatch(switchAccount({ accountId }))}
            onSignInToDifferentAccount={() =>
                dispatch(redirectTo(`/recover-account?fundWithExistingAccount=${encodeURIComponent(JSON.stringify({ accountId, implicitAccountId, recoveryMethod }))}`))
            }
            onClickPrimary={() => {
                setFundingAccountId(signedInAccountId);
                window.scrollTo(0, 0);
            }}
            onClickSecondary={() => history.goBack()}
            hasAllRequiredParams={hasAllRequiredParams}
        />
    );
}