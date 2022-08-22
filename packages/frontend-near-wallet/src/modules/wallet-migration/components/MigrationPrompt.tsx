
import React from 'react';
import { getMyNearWalletUrl } from '../../../utils/constants';
import { styled } from '../../../styles';
import Button from '../../../components/Button';

import MyNearWalletLogo from '../../../assets/images/ImgMyNearWalletLogo';
import { StyledContainer } from '../../../components/styled/Containers';

const MigrationPrompt = ({ handleTransferMyAccounts, handleUseDifferentWallet }) => {
    const destinationWalletBaseUrl = getMyNearWalletUrl();

    return (
        <StyledContainer className="small-centered border">
            <MyNearWalletLogo className="logo" />
            <h3 className='ttl'>We’ve moved!</h3>
            <p className='desc'>
                NEAR Wallet is now My NEAR Wallet, and has moved to a new domain. You can find us at <a href={destinationWalletBaseUrl}>{destinationWalletBaseUrl}</a>.
                <br /><br />
                If you haven’t already, quickly and easily transfer your accounts to the new domain:
            </p>
            <ButtonsContainer>
                <StyledButton onClick={handleTransferMyAccounts}>
                    Transfer My Accounts
                </StyledButton>
                <StyledButton onClick={handleUseDifferentWallet} variant="text">
                    Use a different wallet
                </StyledButton>
            </ButtonsContainer>
        </StyledContainer>
    );
};

export default MigrationPrompt;

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
        marginTop: '5px !important'
    }
});