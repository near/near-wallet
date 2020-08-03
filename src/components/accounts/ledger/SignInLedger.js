import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Theme from './PageTheme.css';
import LedgerImage from '../../svg/LedgerImage';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerConfirmActionModal from './LedgerConfirmActionModal';
import { signInWithLedger, clear, redirectToApp, refreshAccount } from '../../../actions/account';
import RequestStatusBox from '../../common/RequestStatusBox'

export function SignInLedger(props) {
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const signInWithLedgerState = useSelector(({ ledger }) => ledger.signInWithLedger);

    const signInWithLedgerKeys = Object.keys(signInWithLedgerState || {})

    const ledgerAccounts = signInWithLedgerKeys.map((accountId) => ({
        accountId,
        status: signInWithLedgerState[accountId].status
    }))
    
    const accountsApproved = signInWithLedgerKeys.reduce((a, accountId) => signInWithLedgerState[accountId].status === 'success' ? a + 1 : a, 0)
    const totalAccounts = signInWithLedgerKeys.length
    
    const signingIn = signInWithLedgerState !== undefined

    const handleSignIn = async () => {
        const { error } = await dispatch(signInWithLedger())

        if (!error) {
            dispatch(refreshAccount())
            dispatch(redirectToApp())
        }
    }

    return (
        <Theme>
            <h1><Translate id='signInLedger.header'/></h1>
            <LedgerImage/>
            <p className='center'><Translate id='signInLedger.one'/></p>
            <br/>
            <RequestStatusBox requestStatus={account.requestStatus}/>
            <FormButton
                onClick={handleSignIn}
                sending={signingIn}
                sendingString='button.signingIn'
            >
                <Translate id={`button.${account.requestStatus && !account.requestStatus.success ? 'retry' : 'signIn'}`}/>
            </FormButton>
            <button className='link' onClick={() => props.history.goBack()}><Translate id='button.cancel'/></button>

            {signingIn &&
                <LedgerConfirmActionModal 
                    open={signingIn} 
                    onClose={() => dispatch(clear())}
                    ledgerAccounts={ledgerAccounts} 
                    accountsApproved={accountsApproved}
                    totalAccounts={totalAccounts}
                />
            }
        </Theme>
    );
}
