import React from 'react';
import { useDispatch } from 'react-redux';

import SetupLedgerNewAccount from '../components/accounts/ledger/SetupLedgerNewAccount';
import { getLedgerPublicKey, redirectTo } from '../redux/actions/account';
import { showCustomAlert } from '../redux/actions/status';
import { setKeyMeta, wallet } from '../utils/wallet';

export function SetupLedgerNewAccountWrapper() {
    const dispatch = useDispatch();
    return (
        <SetupLedgerNewAccount
            onClickConnectLedger={async () => {
                try {
                    const ledgerPublicKey = await dispatch(getLedgerPublicKey());
                    const implicitAccountId = Buffer.from(ledgerPublicKey.data).toString('hex');
                    const account = wallet.getAccountBasic(implicitAccountId);
                    try {
                        const accountState = await account.state();
                        if (accountState) {
                            // Redirect user to ledger sign in page if account already exists
                            dispatch(redirectTo('/sign-in-ledger'));
                            return;
                        }
                    } catch(e) {
                        if (e.message.includes('does not exist while viewing')) {
                            console.log('implicitAccountId does not exist on chain.');
                        } else {
                            throw e;
                        }
                    }
                    await setKeyMeta(ledgerPublicKey, { type: 'ledger' });
                    dispatch(redirectTo(`/create-implicit-account?implicitAccountId=${implicitAccountId}&recoveryMethod=ledger`));
                } catch (e) {
                    dispatch(showCustomAlert({
                        errorMessage: e.message,
                        success: false,
                        messageCodeHeader: 'error'
                    }));
                    throw e;
                }
            }}
        />
    );
};