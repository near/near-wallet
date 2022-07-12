import React from 'react';
import { useDispatch } from 'react-redux';

import SetupLedgerNewAccount from '../components/accounts/ledger/SetupLedgerNewAccount';
import { getLedgerPublicKey, redirectTo } from '../redux/actions/account';
import { showCustomAlert } from '../redux/actions/status';
import { initiateSetupForZeroBalanceAccountLedger } from '../redux/slices/account/createAccountThunks';
import {
    actions as ledgerActions
} from '../redux/slices/ledger';
import { wallet } from '../utils/wallet';

const {
    checkAndHideLedgerModal
} = ledgerActions;

export function SetupLedgerNewAccountWrapper() {
    const dispatch = useDispatch();
    return (
        <SetupLedgerNewAccount
            onClickConnectLedger={async (path) => {
                try {
                    const ledgerPublicKey = await dispatch(getLedgerPublicKey(path));
                    const implicitAccountId = Buffer.from(ledgerPublicKey.data).toString('hex');
                    const account = wallet.getAccountBasic(implicitAccountId);
                    try {
                        const accountState = await account.state();
                        if (accountState) {
                            // Redirect user to ledger sign in page if account already exists
                            dispatch(redirectTo('/sign-in-ledger'));
                            return;
                        }
                    } catch (e) {
                        if (e.message.includes('does not exist while viewing')) {
                            console.log('implicitAccountId does not exist on chain.');
                        } else {
                            throw e;
                        }
                    }

                    await dispatch(initiateSetupForZeroBalanceAccountLedger({
                        implicitAccountId,
                        ledgerPublicKey,
                        ledgerHdPath: path
                    }));
                    dispatch(redirectTo('/'));
                    dispatch(checkAndHideLedgerModal());
                } catch (e) {
                    dispatch(showCustomAlert({
                        errorMessage: e.message,
                        success: false,
                        messageCodeHeader: 'error'
                    }));
                }
            }}
        />
    );
};
