import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Theme from './PageTheme.css';
import LedgerImage from '../../svg/LedgerImage';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerConfirmActionModal from './LedgerConfirmActionModal';
import { signInWithLedger, clear, redirectToProfile } from '../../../actions/account';

export function SignInLedger(props) {
    const dispatch = useDispatch();
    const account = useSelector(({ account }) => account);
    const signingIn = account.actionsPending.includes('SIGN_IN_WITH_LEDGER')

    const handleSignIn = async () => {
        await dispatch(signInWithLedger())
        dispatch(redirectToProfile())
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
                <LedgerConfirmActionModal open={signingIn} onClose={() => dispatch(clear())}/>
            }
        </Theme>
    );
}