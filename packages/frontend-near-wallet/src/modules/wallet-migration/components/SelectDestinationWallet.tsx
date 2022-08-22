import React from 'react';
import IconWallet from '../../../assets/images/IconWallet';
import { styled } from '../../../styles';

import Button from '../../../components/Button';
import { WALLET_OPTIONS } from '../../../utils/constants';
import { StyledContainer } from '../../../components/styled/Containers';



const SelectDestinationWallet = ({ handleSetWalletType, handleTransferMyAccounts, walletType }) => {
    return (
        <StyledContainer className='small-centered border'>
            <IconWallet />
            <h4 className='title'>Select a wallet to transfer accounts to</h4>
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
            <StyledButton onClick={handleTransferMyAccounts}>
                Continue
            </StyledButton>
        </StyledContainer>
    );
};

export default SelectDestinationWallet;


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

    '& > svg, & > img': {
        height: '48px',
        width: '48px',
    }
})


const StyledButton = styled(Button, {
    width: '100%',
    margin: '48px 0 0 !important',

})

