
import React from 'react';
import Button from '../../../components/Button';
import { styled } from '../../../styles';


import IconAccount from '../../../assets/images/IconAccount';
import IconMigrateAccount from '../../../assets/images/IconMigrateAccount';
import { getAvailableAccounts } from '../../../utils/migration';
import { StyledContainer } from '../../../components/styled/Containers';

const MigrateAccounts = ({ onContinue, onClose }) => {
    const accounts = getAvailableAccounts()

    return (
        <StyledContainer className='small-centered border'>
            <IconMigrateAccount />
            <h3 className='ttl'>We found {accounts.length} active account(s)</h3>
            <p className='desc'>
                The following accounts will be transferred to MyNearWallet:
            </p>
            <AccountListing>
                {
                    accounts.map((account) => (
                        <AccountListingItem
                            key={account}
                            data-accountid={account}>
                            <IconAccount /> {account}
                        </AccountListingItem>
                    ))
                }
            </AccountListing>
            <ButtonsContainer>
                <Button css={{ width: '100%' }} onClick={onContinue} >
                    Continue
                </Button>
                <Button css={{ width: '100%' }} onClick={onClose} variant="text">
                    Cancel
                </Button>
            </ButtonsContainer>
        </StyledContainer>
    );
};

export default MigrateAccounts;


const AccountListing = styled('div', {
    width: '100%',
    marginTop: '56px',
    borderTop: '1px solid #EDEDED'
})

const AccountListingItem = styled('div', {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '16px 32px',
    cursor: 'pointer',
    overflow: 'hidden',

    '&:not(:first-child)': {
        borderTop: '1px solid #EDEDED'
    },
    'svg': {
        flexShrink: 0,
        marginRight: '9px'
    }
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