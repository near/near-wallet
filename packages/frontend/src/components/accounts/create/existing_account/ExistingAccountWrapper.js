import BN from 'bn.js';
import { getLocation } from 'connected-react-router';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { 
    switchAccount,
    getAccountBalance,
    redirectTo
} from '../../../../redux/actions/account';
import {
    selectAccountId,
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

    const availableAccounts = useSelector(({ availableAccounts }) => availableAccounts);
    const accountsBalances = useSelector(selectAccountsBalances);
    const signedInAccountBalance = useSelector(selectBalance);
    const signedInAccountId = useSelector(selectAccountId);

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const accountId = URLParams.get('accountId');
    const implicitAccountId = URLParams.get('implicitAccountId');
    const recoveryMethod = URLParams.get('recoveryMethod');

    if (fundingAccountId) {
        return (
            <FundNewAccount
                onClickPrimary={async () => {
                    try {
                        setCreatingNewAccount(true);
                        await wallet.createNewAccountWithCurrentAccount({
                            accountId,
                            implicitAccountId,
                            initialBalance: MIN_BALANCE_TO_CREATE,
                            recoveryMethod
                        });
                    } catch(e) {
                        // TODO: Show error toast
                        setCreatingNewAccount(false);
                        throw e;
                    }
                    dispatch(redirectTo('/'));
                }}
                onClickSecondary={() => setFundingAccountId('')}
                transferAmount={MIN_BALANCE_TO_CREATE}
                gasFeeAmount={LINKDROP_GAS}
                sender={signedInAccountId}
                receiver={accountId}
                creatingNewAccount={creatingNewAccount}
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
            onSelectAccount={(accountId => dispatch(switchAccount({ accountId })))}
            onSignInToDifferentAccount={() =>
                dispatch(redirectTo(`/recover-account?fundWithExistingAccount=${encodeURIComponent(JSON.stringify({ accountId, implicitAccountId, recoveryMethod }))}`))
            }
            onClickPrimary={() => {
                // FIX: Make sure URL params are solid before allowing user to move forward
                setFundingAccountId(signedInAccountId);
                window.scrollTo(0, 0);
            }}
            onClickSecondary={() => history.goBack()}
        />
    );
}