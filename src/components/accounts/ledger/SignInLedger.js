import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Theme from './PageTheme.css';
import LedgerImage from '../../svg/LedgerImage';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerSignInModal from './LedgerSignInModal';
import { 
    signInWithLedger, 
    clear, 
    redirectToApp, 
    refreshAccount, 
    signInWithLedgerAddAndSaveAccounts, 
    checkAccountAvailable, 
    setFormLoader, 
    clearSignInWithLedgerModalState
} from '../../../actions/account';
import RequestStatusBox from '../../common/RequestStatusBox'

export function SignInLedger(props) {
    const dispatch = useDispatch();

    const [accountId, setAccountId] = useState('');
    const [loader, setLoader] = useState(false);

    const account = useSelector(({ account }) => account);
    const { signInWithLedger: signInWithLedgerState, txSigned, signInWithLedgerStatus} = useSelector(({ ledger }) => ledger);
    
    const signInWithLedgerKeys = Object.keys(signInWithLedgerState || {})

    const ledgerAccounts = signInWithLedgerKeys.map((accountId) => ({
        accountId,
        status: signInWithLedgerState[accountId].status
    }))
    
    const accountsApproved = signInWithLedgerKeys.reduce((a, accountId) => signInWithLedgerState[accountId].status === 'success' ? a + 1 : a, 0)
    const totalAccounts = signInWithLedgerKeys.length
    
    const signingIn = !!signInWithLedgerStatus

    const handleChange = (e, { value }) => {
        setAccountId(value)
    }

    const handleSignIn = async () => {
        const { error } = await dispatch(signInWithLedger())

        if (!error) {
            refreshAndRedirect()
        }
    }

    const handleAdditionalAccountId = async () => {
        setLoader(true)
        const { error } = await dispatch(signInWithLedgerAddAndSaveAccounts([accountId]))
        setLoader(false)
        
        if (!error) {
            refreshAndRedirect()
        }
    }

    const refreshAndRedirect = () => {
        dispatch(refreshAccount())
        dispatch(redirectToApp())
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
                <LedgerSignInModal 
                    open={signingIn} 
                    onClose={() => dispatch(clear())}
                    ledgerAccounts={ledgerAccounts} 
                    accountsApproved={accountsApproved}
                    totalAccounts={totalAccounts}
                    txSigned={txSigned}
                    handleAdditionalAccountId={handleAdditionalAccountId}
                    signInWithLedgerStatus={signInWithLedgerStatus}
                    accountId={accountId}
                    handleChange={handleChange}
                    requestStatus={account.requestStatus}
                    checkAccountAvailable={(accountId) => dispatch(checkAccountAvailable(accountId))}
                    setFormLoader={(state) => dispatch(setFormLoader(state))}
                    formLoader={account.formLoader}
                    clearRequestStatus={() => dispatch(clear())}
                    stateAccountId={account.accountId}
                    loader={loader}
                    clearSignInWithLedgerModalState={() => dispatch(clearSignInWithLedgerModalState())}
                />
            }
        </Theme>
    );
}
