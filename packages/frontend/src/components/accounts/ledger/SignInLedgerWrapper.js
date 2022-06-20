import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import {
    redirectToApp,
    redirectTo,
    clearAccountState
} from '../../../redux/actions/account';
import { clearGlobalAlert } from '../../../redux/actions/status';
import { actions as importZeroBalanceAccountActions } from '../../../redux/slices/importZeroBalanceAccount';
import { importZeroBalanceAccountLedger } from '../../../redux/slices/importZeroBalanceAccount/importAccountThunks';
import { actions as ledgerActions, LEDGER_HD_PATH_PREFIX, LEDGER_MODAL_STATUS, selectLedgerSignInWithLedger, selectLedgerSignInWithLedgerStatus, selectLedgerTxSigned } from '../../../redux/slices/ledger';
import Container from '../../common/styled/Container.css';
import Authorize from './SignInLedgerViews/Authorize';
import ImportAccounts from './SignInLedgerViews/ImportAccounts';
import SignIn from './SignInLedgerViews/SignIn';

const { setZeroBalanceAccountImportMethod } = importZeroBalanceAccountActions;
const {
    signInWithLedger,
    clearSignInWithLedgerModalState
} = ledgerActions;

export const VIEWS = {
    AUTHORIZE: 'authorize',
    SIGN_IN: 'signIn',
    ENTER_ACCOUNT_ID: 'enterAccountId',
    IMPORT_ACCOUNTS: 'importAccounts',
    SUCCESS: 'success'
};

export function SignInLedgerWrapper(props) {
    const dispatch = useDispatch();
    const [confirmedPath, setConfirmedPath] = useState(1);
    const ledgerHdPath = `${LEDGER_HD_PATH_PREFIX}${confirmedPath}'`;

    const signInWithLedgerState = useSelector(selectLedgerSignInWithLedger);
    const txSigned = useSelector(selectLedgerTxSigned);
    const signInWithLedgerStatus = useSelector(selectLedgerSignInWithLedgerStatus);

    const signInWithLedgerKeys = Object.keys(signInWithLedgerState || {});

    const ledgerAccounts = signInWithLedgerKeys.map((accountId) => ({
        accountId,
        status: signInWithLedgerState[accountId].status
    }));

    const accountsApproved = signInWithLedgerKeys.reduce((a, accountId) => signInWithLedgerState[accountId].status === 'success' ? a + 1 : a, 0);
    const accountsError = signInWithLedgerKeys.reduce((a, accountId) => signInWithLedgerState[accountId].status === 'error' ? a + 1 : a, 0);
    const accountsRejected = signInWithLedgerKeys.reduce((a, accountId) => signInWithLedgerState[accountId].status === 'rejected' ? a + 1 : a, 0);
    const totalAccounts = signInWithLedgerKeys.length;

    useEffect(() => {
        dispatch(clearSignInWithLedgerModalState());
    }, []);

    useEffect(() => {
        if (signInWithLedgerStatus === LEDGER_MODAL_STATUS.ENTER_ACCOUNTID) {
            const handleImportZeroBalanceAccountLedger = async () => {
                dispatch(clearGlobalAlert());
                await dispatch(importZeroBalanceAccountLedger(ledgerHdPath));
                // TODO: Provide ledger public key as prop to avoid asking for it again
                dispatch(setZeroBalanceAccountImportMethod('ledger'));
                dispatch(clearAccountState());
                dispatch(redirectToApp());
            };
            handleImportZeroBalanceAccountLedger();
        }
    }, [signInWithLedgerStatus]);

    const handleSignIn = async () => {
        await Mixpanel.withTracking('IE-Ledger Sign in',
            async () => {
                await dispatch(signInWithLedger({ path: ledgerHdPath })).unwrap();
            }
        );
    };

    const handleContinue = () => {
        dispatch(redirectToApp());
    };

    const handleCancelSignIn = () => {
        dispatch(clearSignInWithLedgerModalState());
    };

    const handleCancelAuthorize = () => {
        dispatch(redirectTo('/recover-account'));
    };

    return (
        <>
            <Container className='small-centered border ledger-theme'>
                {!signInWithLedgerStatus &&
                    <Authorize
                        confirmedPath={confirmedPath}
                        setConfirmedPath={setConfirmedPath}
                        handleSignIn={handleSignIn}
                        signingIn={!!signInWithLedgerStatus}
                        handleCancel={handleCancelAuthorize}
                    />
                }
                {(signInWithLedgerStatus === LEDGER_MODAL_STATUS.CONFIRM_PUBLIC_KEY
                    || signInWithLedgerStatus === LEDGER_MODAL_STATUS.ENTER_ACCOUNTID) &&
                    <SignIn
                        txSigned={txSigned}
                        handleCancel={handleCancelSignIn}
                    />
                }
                {(signInWithLedgerStatus === LEDGER_MODAL_STATUS.CONFIRM_ACCOUNTS || signInWithLedgerStatus === LEDGER_MODAL_STATUS.SUCCESS) &&
                    <ImportAccounts
                        accountsApproved={accountsApproved}
                        totalAccounts={totalAccounts}
                        ledgerAccounts={ledgerAccounts}
                        accountsError={accountsError}
                        accountsRejected={accountsRejected}
                        signInWithLedgerStatus={signInWithLedgerStatus}
                        handleContinue={handleContinue}
                    />
                }
            </Container>
        </>
    );
}
