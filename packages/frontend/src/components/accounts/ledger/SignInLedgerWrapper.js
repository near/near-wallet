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
import { selectAccountSlice } from '../../../redux/slices/account';
import { actions as ledgerActions, LEDGER_HD_PATH_PREFIX, LEDGER_MODAL_STATUS, selectLedgerSignInWithLedger, selectLedgerSignInWithLedgerStatus, selectLedgerTxSigned } from '../../../redux/slices/ledger';
import { selectStatusMainLoader } from '../../../redux/slices/status';
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
    const [confirmedPath, setConfirmedPath] = useState(1);
    const ledgerHdPath = `${LEDGER_HD_PATH_PREFIX}${confirmedPath}'`;

    const account = useSelector(selectAccountSlice);
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

    const handleCancelSignIn = () => {
        dispatch(clearSignInWithLedgerModalState());
    };
    
    const handleCancelAuthorize = () => {
        dispatch(redirectTo('/recover-account'));
    };

    return (
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
            {signInWithLedgerStatus === LEDGER_MODAL_STATUS.CONFIRM_PUBLIC_KEY &&
                <SignIn
                    txSigned={txSigned}
                    handleCancel={handleCancelSignIn}
                />
            }
            {signInWithLedgerStatus === LEDGER_MODAL_STATUS.ENTER_ACCOUNTID && 
                <EnterAccountId
                    handleAdditionalAccountId={handleAdditionalAccountId}
                    accountId={accountId}
                    handleChange={handleChange}
                    checkAccountAvailable={(accountId) => dispatch(checkAccountAvailable(accountId))}
                    mainLoader={mainLoader}
                    stateAccountId={account.accountId}
                    loader={loader}
                    clearSignInWithLedgerModalState={() => dispatch(clearSignInWithLedgerModalState())}
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
    );
}
