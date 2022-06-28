
import React from 'react';
import { WALLET_MIGRATION_VIEWS } from '../utils/constants';
import { styled } from '../styles';
import Button from './Button';

import MyNearWalletLogo from '../assets/images/ImgMyNearWalletLogo';

const MigrationPrompt = ({ handleSetActiveView, handleRedirectToBatchImport }) => {
    return (
        <StyledContainer>
            <MyNearWalletLogo className="logo" />
            <h3 className='ttl'>We’ve moved!</h3>
            <p className='desc'>
                NEAR Wallet is now My NEAR Wallet, and has moved to a new domain. You can find us at <a href='https://mynearwallet.com'>https://mynearwallet.com</a>.
                <br /><br />
                If you haven’t already, quickly and easily transfer your accounts to the new domain:
            </p>
            <ButtonsContainer>
                <StyledButton onClick={handleRedirectToBatchImport}>
                    Transfer My Accounts
                </StyledButton>
                <StyledButton onClick={() => { handleSetActiveView(WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET); }} variant="text">
                    Use a different wallet
                </StyledButton>
            </ButtonsContainer>
        </StyledContainer>
    );
};

export default MigrationPrompt;

const StyledContainer = styled('section', {
    maxWidth: '396px',
    margin: '0 auto',
    padding: '0 20px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',

    '& > .logo': {
        maxWidth: '200px',
        width: '100%',
    },

    '& > .ttl': {
        margin: '0 auto 24px',
        textAlign: 'center',
    },

    '& > .desc': {
        color: '#72727A'
    }
})

const ButtonsContainer = styled('div', {
    marginTop: '72px',
    textAlign: 'center',
    width: '100% !important'
});

const StyledButton = styled(Button, {
    color: '$white',
    textAlign: 'center',
    background: '#0072CE',
    borderRadius: '50px',
    width: '100%',
    height: '56px',
    cursor: 'pointer',
    margin: '0 !important',
    '&:not(:first-child)': {
        marginTop: '10px !important'
    }
});