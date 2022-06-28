import React from 'react';
import IconWallet from '../assets/images/IconWallet';

import { styled } from '../styles';
import { WALLET_MIGRATION_VIEWS } from '../utils/constants';
import { WALLET_OPTIONS } from '../utils/migration';
import Button from './Button';


const StyledContainer = styled('div', {
    maxWidth: '396px',
    margin: '0 auto',
    padding: '0 20px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',

    '& .title': {
        fontWeight: 800,
        fontSize: '20px',
        marginTop: '40px',
    }
})

const WalletOptionsListing = styled('div', {
    marginTop: '40px',
    width: '100%',
})

const WalletOptionsListingItem = styled('div', {
    position: 'relative',
    backgroundColor: '#FAFAFA',
    width: '100%',
    padding: '14px 17.5px',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '&:hover': {
        background: '#F0F9FF',
    },

    '&:not(:first-child)': {
        marginTop: '8px',
    },

    '&:before': {
        content: '""',
        height: '22px',
        width: '22px',
        top: 'calc((100% - 22px) / 2)',
        border: '2px solid #E6E6E6',
        borderRadius: '50%',
        position: 'absolute',
    },

    '&.active': {
        backgroundColor: '#F0F9FF',
        borderLeft: 'solid 4px #2B9AF4',

        '&:before': {
            backgroundColor: '$blue',
            borderColor: '$blue'
        },

        '&:after': {
            content: '',
            position: 'absolute',
            transform: 'rotate(45deg)',
            left: '23px',
            top: '33px',
            height: '11px',
            width: '11px',
            backgroundColor: '$white',
            borderRadius: '50%',
            boxShadow: '1px 0px 2px 0px #0000005',
        }
    },

    '& .name': {
        fontSize: '16px',
        fontWeight: 700,
        paddingLeft: '40px',
        textAlign: 'left',
        color: '#3F4045'
    },

    '& > svg': {
        height: '48px',
        width: '48px',
        borderRadius: '50%'
    }
})

const ButtonsContainer = styled('div', {
    textAlign: 'center',
    width: '100% !important',
    display: 'flex'
})

const StyledButton = styled(Button, {
    width: 'calc((100% - 16px) / 2)',
    margin: '48px 0 0 !important',

    '&:last-child': {
        marginLeft: '16px !important'
    }
})



const SelectDestinationWallet = ({ handleSetActiveView, handleSetWalletType, handleRedirectToBatchImport, walletType }) => {
    return (
        <StyledContainer>
            <IconWallet />
            <h4 className='title'>Select a wallet to transfer accounts</h4>
            <WalletOptionsListing>
                {WALLET_OPTIONS.map(({ id, name, icon }) => {
                    const isSelected = id === walletType;
                    return <WalletOptionsListingItem
                        className={`${isSelected ? 'active' : ''}`}
                        onClick={() => handleSetWalletType(id)}
                        key={name}
                    >
                        <h4 className='name'>{name}</h4>
                        {icon}
                    </WalletOptionsListingItem>;
                })}
            </WalletOptionsListing>
            <ButtonsContainer>
                <StyledButton onClick={() => { handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT); }} variant="gray">
                    Cancel
                </StyledButton>
                <StyledButton onClick={handleRedirectToBatchImport}>
                    Continue
                </StyledButton>
            </ButtonsContainer>
        </StyledContainer>
    );
};

export default SelectDestinationWallet;