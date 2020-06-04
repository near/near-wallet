import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import LedgerImage from '../../svg/LedgerImage';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerConfirmActionModal from './LedgerConfirmActionModal';
import { signInWithLedger } from '../../../actions/account';

const SignInLedger = (props) => {

    const [signingIn, setSigningIn] = useState('');

    const handleSignIn = () => {
        setSigningIn('true');
        props.signInWithLedger()
            .then(({ error }) => {
                if (error) {
                    return setSigningIn('fail')
                }
                props.history.push('/');
        })
    }

    return (
        <Theme>
            <h1><Translate id='signInLedger.header'/></h1>
            <LedgerImage/>
            <p><Translate id='signInLedger.one'/></p>
            <FormButton
                onClick={handleSignIn}
                sending={signingIn === 'true'}
                sendingString='button.signingIn'
            >
                <Translate id={`button.${signingIn === 'fail' ? 'retry' : 'signIn'}`}/>
            </FormButton>
            <button className='link' onClick={() => props.history.goBack()}><Translate id='button.cancel'/></button>
            {signingIn &&
                <LedgerConfirmActionModal open={signingIn} onClose={() => setSigningIn('')}/>
            }
        </Theme>
    );
}

const mapDispatchToProps = {
    signInWithLedger
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SignInWithLedgerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SignInLedger);