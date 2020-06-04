import React, { useState } from 'react';
import { connect } from 'react-redux';
import Theme from './PageTheme.css';
import LedgerImage from '../../svg/LedgerImage';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerConfirmActionModal from './LedgerConfirmActionModal';

const SignInLedger = (props) => {

    const [signingIn, setSigningIn] = useState();

    const handleSignIn = () => {
        setSigningIn(true);
    }

    return (
        <Theme>
            <h1><Translate id='signInLedger.header'/></h1>
            <LedgerImage/>
            <p><Translate id='signInLedger.one'/></p>
            <FormButton onClick={handleSignIn}><Translate id='button.signIn'/></FormButton>
            <button className='link' onClick={() => props.history.goBack()}><Translate id='button.cancel'/></button>
            {signingIn &&
                <LedgerConfirmActionModal open={signingIn} onClose={() => setSigningIn()}/>
            }
        </Theme>
    );
}

const mapDispatchToProps = {

}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SignInWithLedgerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SignInLedger);