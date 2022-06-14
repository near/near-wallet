import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconLedger from '../../images/wallet-migration/IconLedger';
import IconMyNearWallet from '../../images/wallet-migration/IconMyNearWallet';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import { WALLET_MIGRATION_VIEWS } from './WalletMigration';


const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 48px 28px 12px;
    }
`;

const WalletOptionsListing = styled.div`
    margin-top: 40px;
`;

const WalletOptionsListingItem = styled.div`
    position: relative;
    background-color: #FAFAFA;
    padding: 14px 16px;
    cursor: pointer;
    text-align: left;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &:hover {
        background: #F0F9FF;
    }

    &:before {
        content: '';
        height: 22px;
        width: 22px;
        top: calc((100% - 22px) / 2);
        border: 2px solid #E6E6E6;
        border-radius: 50%;
        position: absolute;
    }

    .name {
        font-size: 16px;
        font-weight: 700;
        padding-left: 40px;
        text-align: left;
        color: #3F4045;
    }

    &:not(:first-child) {
        margin-top: 8px;
    }
`;

const ButtonsContainer = styled.div`
    text-align: center;
    width: 100% !important;
    display: flex;
`;

const StyledButton = styled(FormButton)`
    width: calc((100% - 16px) / 2);
    margin: 48px 0 0 !important;

    &:last-child{
        margin-left: 16px !important;
    }
`;

const WALLET_OPTIONS = [
    {
        name: 'My NEAR Wallet',
        icon: <IconMyNearWallet/>,
    },
    {
        name: 'Ledger',
        icon: <IconLedger/>,
    },
    {
        name: 'Sender Wallet',
        icon: <IconLedger/>,
    },
    {
        name: 'Dojo Finance Wallet',
        icon: <IconLedger/>,
    },
    {
        name: 'Meteor Wallet',
        icon: <IconLedger/>,
    },
    {
        name: 'Cuvar Wallet',
        icon: <IconLedger/>,
    },
];


const SelectDestinationWallet = ({ handleSetActiveView }) => {
    return (
        <Modal
            modalClass="slim"
            id='migration-modal'
            isOpen={true}
            disableClose={true}
            modalSize='md'
            style={{ maxWidth: '431px' }}
        >
            <Container>
                <h3><Translate id='walletMigration.selectWallet.title'/></h3>
                <WalletOptionsListing>
                    {WALLET_OPTIONS.map(({ name, icon }) => {
                        return <WalletOptionsListingItem key={name}>
                            <h4 className='name'>{name}</h4>
                            {icon}
                        </WalletOptionsListingItem>;
                    })}
                </WalletOptionsListing>
                <ButtonsContainer>
                    <StyledButton className="gray-blue" onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);}}>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    <StyledButton onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.GENERATE_MIGRATION_PIN);}}>
                        <Translate id='button.continue' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </Modal>
    );
};

export default SelectDestinationWallet;
