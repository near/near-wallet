import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Theme from './PageTheme.css';
import LedgerImage from '../../svg/LedgerImage';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerConfirmActionModal from './LedgerConfirmActionModal';
import { signInWithLedger, clear, redirectToApp, refreshAccount } from '../../../actions/account';

export function SignInLedger(props) {
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);

    const gettingAccounts = account.actionsPending.includes('GET_LEDGER_ACCOUNT_IDS')
    const addingAccounts = account.actionsPending.includes('ADD_LEDGER_ACCOUNT_ID')
    const savingAccounts = account.actionsPending.includes('SAVE_AND_SELECT_LEDGER_ACCOUNTS')
    const signingIn = gettingAccounts || addingAccounts || savingAccounts

    const ledgerAccounts = addingAccounts && Object.keys(account.signInWithLedger).map((accountId) => {
        return {
            accountId,
            status: account.signInWithLedger[accountId] === 'waiting'
                ? 'confirm'
                : typeof account.signInWithLedger[accountId] === 'object'
                    ? 'success'
                    : 'pending'
        }
    })

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
            <p><Translate id='signInLedger.one'/></p>
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
                    gettingAccounts={gettingAccounts}
                    addingAccounts={addingAccounts}
                />
            }
        </Theme>
    );
}
