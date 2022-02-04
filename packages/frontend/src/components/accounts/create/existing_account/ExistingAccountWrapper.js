import { getLocation } from 'connected-react-router';
import { parse } from 'query-string';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { LINKDROP_GAS, MIN_BALANCE_TO_CREATE } from '../../../../config';
import { Mixpanel } from '../../../../mixpanel';
import {
    switchAccount,
    getAccountBalance,
    redirectTo
} from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { selectAccountAccountsBalances, selectAccountLocalStorageAccountId, selectBalance } from '../../../../redux/slices/account';
import { selectAvailableAccounts } from '../../../../redux/slices/availableAccounts';
import {
    actions as ledgerActions
} from '../../../../redux/slices/ledger';
import { wallet } from '../../../../utils/wallet';
import FundNewAccount from './FundNewAccount';
import SelectAccount from './SelectAccount';

const {
    checkAndHideLedgerModal
} = ledgerActions;

export function ExistingAccountWrapper({ history }) {
    const dispatch = useDispatch();

    const [fundingAccountId, setFundingAccountId] = useState('');
    const [creatingNewAccount, setCreatingNewAccount] = useState(false);

    const signedInAccountId = useSelector(selectAccountLocalStorageAccountId);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountsBalances = useSelector(selectAccountAccountsBalances);
    const signedInAccountBalance = useSelector(selectBalance);
    const location = useSelector(getLocation);
    const URLParams = parse(location.search);
    const accountId = URLParams.accountId;
    const implicitAccountId = URLParams.implicitAccountId;
    const recoveryMethod = URLParams.recoveryMethod;
    const hasAllRequiredParams = !!accountId && !!implicitAccountId && !!recoveryMethod;

    if (fundingAccountId) {
        return (
            <FundNewAccount
                onClickApprove={async () => {
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
                        },
                        () => {
                            dispatch(checkAndHideLedgerModal());
                        }
                    );
                    dispatch(redirectTo('/'));
                }}
                onClickCancel={() => setFundingAccountId('')}
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
            onClickNext={() => {
                setFundingAccountId(signedInAccountId);
                window.scrollTo(0, 0);
            }}
            onClickCancel={() => history.goBack()}
            hasAllRequiredParams={hasAllRequiredParams}
        />
    );
}