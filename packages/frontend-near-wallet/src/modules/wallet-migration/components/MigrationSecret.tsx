
import React, { useCallback, useState } from 'react';
import Button from '../../../components/Button';
import { styled } from '../../../styles';
import MyNearWalletLogo from '../../../assets/images/ImgMyNearWalletLogo';
import ClickToCopy from '../../../components/ClickToCopy';
import CopyIcon from '../../../components/svg/CopyIcon';

const MigrationSecret = ({ secretKey, handleCancel, showMigrateAccount }) => {
    const [shouldContinueDisabled, setContinueDisabled] = useState(true);

    const setContinueEnable = useCallback(() => {
        setContinueDisabled(false);
    }, []);

    return (
        <StyledContainer>
            <MyNearWalletLogo className="logo" />
            <h3 className='ttl'>Password required to import accounts</h3>
            <p className='desc'>
                You'll need this <strong>password</strong> to securely import your accounts to MyNearWallet. Copy or write it down until you've completed transferring your accounts.
            </p>
            <ClickToCopy
                copy={secretKey}
                onClick={setContinueEnable}>
                <TextSelectDisplay>
                    {secretKey}
                <CopyIcon style={{ margin:"5px" }} color='#2B9AF4' />
                </TextSelectDisplay>
            </ClickToCopy>
            <ButtonsContainer>
                <Button css={{ width: '100%' }} onClick={showMigrateAccount} disabled={shouldContinueDisabled}>
                    Continue
                </Button>
                <Button css={{ width: '100%' }} onClick={handleCancel} variant="text">
                    Cancel
                </Button>
            </ButtonsContainer>
        </StyledContainer>
    );
};

export default MigrationSecret;

const StyledContainer = styled('section', {
    maxWidth: '400px',
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
        fontWeight: 800,
    },

    '& > .desc': {
        color: '#72727A'
    }
})

const TextSelectDisplay = styled('div', {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: "20px",
    background: "#ccc",
    borderRadius: "8px",
    wordBreak: "break-word",
    textAlign: "center",
    marginTop: "16px",
})

const ButtonsContainer = styled('div', {
    marginTop: '72px',
    textAlign: 'center',
    width: '100% !important',
    display: 'flex',
    flexDirection: 'column',
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