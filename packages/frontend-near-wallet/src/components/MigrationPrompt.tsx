
import React from 'react';
import { Translate } from 'react-localize-redux';
import { WALLET_MIGRATION_VIEWS } from '../utils/constants';
import { styled } from '../styles';
import Button from './Button';

// import IconClose from '../../images/IconClose';
// import FormButton from '../common/FormButton';
// import Container from '../common/styled/Container.css';

const StyledContainer = styled('section', {
    maxWidth: '356px',
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',

    '& > .ttl': {
        margin: '0 auto 24px',
        textAlign: 'center',
    },

    '& > .desc': {
        color: '#72727A'
    }
})

const ContentContainer = styled('div', {})

// `
//     padding: 15px 0;
//     text-align: center;
//     max-width: 362px;
//     margin: 0 auto;
//     @media (max-width: 360px) {
//         padding: 0;
//     }
//     .close-icon {
//         position: absolute;
//         height: 16px;
//         width: 16px;
//         right: 24px;
//         top: 24px;
//         cursor: pointer;
//     }
//     .logo {
//         width: 100%;
//         max-width: 200px;
//     }
//     .title{
//         font-size: 20px;
//         margin-top: 16px;
//     }
// `;


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

const MigrationPrompt = ({ handleSetActiveView, handleRedirectToBatchImport }) => {
    return (
        <StyledContainer>
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