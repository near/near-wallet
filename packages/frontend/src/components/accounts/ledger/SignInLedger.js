import { parse as parseQuery, stringify } from 'query-string';
import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
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
import { controller as controllerHelperApi } from '../../../utils/helper-api';
import parseFundingOptions from '../../../utils/parseFundingOptions';
import FormButton from '../../common/FormButton';
import LocalAlertBox from '../../common/LocalAlertBox';
import Container from '../../common/styled/Container.css';
import LedgerImageCircle from '../../svg/LedgerImageCircle';
import LedgerHdPaths from './LedgerHdPaths';
import LedgerSignInModal from './LedgerSignInModal';

const { 
    signInWithLedger,
    signInWithLedgerAddAndSaveAccounts,
    clearSignInWithLedgerModalState
} = ledgerActions;

export function SignInLedger(props) {
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

    const signingIn = !!signInWithLedgerStatus;

    const handleChange = (value) => {
        setAccountId(value);
    };

    const handleSignIn = async () => {
        setLoader(false);
        await Mixpanel.withTracking('IE-Ledger Sign in',
            async () => {
                await dispatch(signInWithLedger({ path: ledgerHdPath })).unwrap();
                refreshAndRedirect();
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

    const onClose = () => {
        Mixpanel.track('IE-Ledger Close ledger confirmation');
        if (signInWithLedgerStatus === LEDGER_MODAL_STATUS.CONFIRM_PUBLIC_KEY) {
            controllerHelperApi.abort();
        }
        if (signInWithLedgerStatus === LEDGER_MODAL_STATUS.ENTER_ACCOUNTID) {
            dispatch(clearSignInWithLedgerModalState());
        }
    };

    return (
        <Container className='small-centered border ledger-theme'>
            <LedgerImageCircle />
            <h1><Translate id='signInLedger.header' /></h1>
            <Translate id='signInLedger.one' />
            <br /><br />
            <LocalAlertBox localAlert={status.localAlert} />
            <LedgerHdPaths
                path={path}
                onSetPath={(path) => setPath(path)}
                onConfirmHdPath={() => {
                    setConfirmedPath(path);
                    Mixpanel.track('IE-Ledger Sign in set custom HD path');
                }}
            />
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={handleSignIn}
                    sending={signingIn}
                    sendingString='button.signingIn'
                >
                    <Translate id='button.authorize' />
                </FormButton>
                <FormButton
                    className='gray link'
                    onClick={() => props.history.goBack()}
                    trackingId='IE-Ledger Click cancel button'
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </div>
            {signingIn &&
                <LedgerSignInModal
                    open={signingIn}
                    onClose={onClose}
                    ledgerAccounts={ledgerAccounts}
                    accountsApproved={accountsApproved}
                    accountsError={accountsError}
                    accountsRejected={accountsRejected}
                    totalAccounts={totalAccounts}
                    txSigned={txSigned}
                    handleAdditionalAccountId={handleAdditionalAccountId}
                    signInWithLedgerStatus={signInWithLedgerStatus}
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
            }
        </Container>
    );
}
