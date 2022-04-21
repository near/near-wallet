import { parse as parseQuery, stringify } from 'query-string';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import {
    redirectToApp,
    redirectTo,
    refreshAccount,
    checkAccountAvailable,
    clearAccountState
} from '../../../redux/actions/account';
import { clearLocalAlert } from '../../../redux/actions/status';
import { selectAccountSlice } from '../../../redux/slices/account';
import { actions as ledgerActions, LEDGER_MODAL_STATUS, selectLedgerSignInWithLedger, selectLedgerSignInWithLedgerStatus, selectLedgerTxSigned } from '../../../redux/slices/ledger';
import { selectStatusMainLoader, selectStatusSlice } from '../../../redux/slices/status';
import parseFundingOptions from '../../../utils/parseFundingOptions';
import Container from '../../common/styled/Container.css';
import Authorize from './SignInLedgerViews/Authorize';
import EnterAccountId from './SignInLedgerViews/EnterAccountId';
import ImportAccounts from './SignInLedgerViews/ImportAccounts';
import SignIn from './SignInLedgerViews/SignIn';

const { 
    signInWithLedger,
    signInWithLedgerAddAndSaveAccounts,
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

    const [accountId, setAccountId] = useState('');
    const [loader, setLoader] = useState(false);
    const [path, setPath] = useState(1);
    const [confirmedPath, setConfirmedPath] = useState(null);
    const ledgerHdPath = confirmedPath ? `44'/397'/0'/0'/${confirmedPath}'` : null;

    const account = useSelector(selectAccountSlice);
    const status = useSelector(selectStatusSlice);
    const signInWithLedgerState = useSelector(selectLedgerSignInWithLedger);
    const txSigned = useSelector(selectLedgerTxSigned);
    const signInWithLedgerStatus = useSelector(selectLedgerSignInWithLedgerStatus);
    const mainLoader = useSelector(selectStatusMainLoader);

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

    const handleChange = (value) => {
        setAccountId(value);
    };

    const handleSignIn = async () => {
        setLoader(false);
        await Mixpanel.withTracking('IE-Ledger Sign in',
            async () => {
                await dispatch(signInWithLedger({ path: ledgerHdPath })).unwrap();
            }
        );
    };

    const handleAdditionalAccountId = async () => {
        setLoader(true);
        await Mixpanel.withTracking('IE-Ledger Handle additional accountId',
            async () => {
                await dispatch(signInWithLedgerAddAndSaveAccounts({ path: ledgerHdPath, accountIds: [accountId] }));
                setLoader(false);
                refreshAndRedirect();
            }
        );
    };

    const refreshAndRedirect = () => {
        dispatch(refreshAccount());

        const { search } = props.history.location;
        const fundWithExistingAccount = parseQuery(search, { parseBooleans: true }).fundWithExistingAccount;
        if (fundWithExistingAccount) {
            const createNewAccountParams = stringify(JSON.parse(fundWithExistingAccount));
            dispatch(redirectTo(`/fund-with-existing-account?${createNewAccountParams}`));
        } else {
            const options = parseFundingOptions(search);
            if (options) {
                dispatch(redirectTo(`/linkdrop/${options.fundingContract}/${options.fundingKey}`));
            } else {
                dispatch(redirectToApp());
            }
        }

        dispatch(clearAccountState());
    };

    const handleContinue = () => {
        dispatch(redirectToApp());
    };

    const handleCancel = () => {
        dispatch(clearSignInWithLedgerModalState());
    };

    const activeView = () => {
        if (!signInWithLedgerStatus) {
            return VIEWS.AUTHORIZE;
        }
        if (signInWithLedgerStatus === LEDGER_MODAL_STATUS.CONFIRM_PUBLIC_KEY) {
            return VIEWS.SIGN_IN;
        }
        if (signInWithLedgerStatus === LEDGER_MODAL_STATUS.ENTER_ACCOUNTID) {
            return VIEWS.ENTER_ACCOUNT_ID;
        }
        if (signInWithLedgerStatus === LEDGER_MODAL_STATUS.CONFIRM_ACCOUNTS || signInWithLedgerStatus === LEDGER_MODAL_STATUS.SUCCESS) {
            return VIEWS.IMPORT_ACCOUNTS;
        }
    };

    const getCurrentViewComponent = (view) => {
        switch (view) {
            case VIEWS.AUTHORIZE:
                return (
                    <Authorize
                        status={status}
                        path={path}
                        setPath={setPath}
                        setConfirmedPath={setConfirmedPath}
                        handleSignIn={handleSignIn}
                        signingIn={!!signInWithLedgerStatus}
                />
                );
            case VIEWS.SIGN_IN:
                return (
                    <SignIn
                        txSigned={txSigned}
                        handleCancel={handleCancel}
                    />
                );
            case VIEWS.ENTER_ACCOUNT_ID:
                return (
                    <EnterAccountId
                        handleAdditionalAccountId={handleAdditionalAccountId}
                        accountId={accountId}
                        handleChange={handleChange}
                        localAlert={status.localAlert}
                        checkAccountAvailable={(accountId) => dispatch(checkAccountAvailable(accountId))}
                        mainLoader={mainLoader}
                        clearLocalAlert={() => dispatch(clearLocalAlert())}
                        stateAccountId={account.accountId}
                        loader={loader}
                        clearSignInWithLedgerModalState={() => dispatch(clearSignInWithLedgerModalState())}
                    />
                );
            case VIEWS.IMPORT_ACCOUNTS:
                return (
                    <ImportAccounts
                        accountsApproved={accountsApproved}
                        totalAccounts={totalAccounts}
                        ledgerAccounts={ledgerAccounts}
                        accountsError={accountsError}
                        accountsRejected={accountsRejected}
                        signInWithLedgerStatus={signInWithLedgerStatus}
                        handleContinue={handleContinue}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Container className='small-centered border ledger-theme'>
            {getCurrentViewComponent(activeView())}
        </Container>
    );
}
