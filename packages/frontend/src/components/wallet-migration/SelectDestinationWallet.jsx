import React, { useCallback } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import ImgFinerWallet from '../../../src/images/finer-logo.svg';
import ImgMeteorWallet from '../../../src/images/meteor-wallet-logo.svg';
import ImgMyNearWallet from '../../../src/images/mynearwallet-cropped.svg';
import SenderLogo from '../../../src/images/sender-logo.png';
import isMobile from '../../../src/utils/isMobile';
import IconLedger from '../../images/wallet-migration/IconLedger';
import IconWallet from '../../images/wallet-migration/IconWallet';
import { redirectTo } from '../../redux/actions/account';
import classNames from '../../utils/classNames';
import {
    getMeteorWalletUrl,
    getMyNearWalletUrlFromNEARORG
} from '../../utils/getWalletURL';
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

    .title {
        font-weight: 800;
        font-size: 20px;
        margin-top: 40px;
    }
`;

const WALLET_OPTIONS = [
    {
        id: 'my-near-wallet',
        name: 'My NEAR Wallet',
        icon: <img src={ImgMyNearWallet} alt="MyNearWallet Logo" />,
        getUrl: ({ hash }) => `${getMyNearWalletUrlFromNEARORG()}/batch-import#${hash}`,
        checkAvailability: () => true,
    },
    {
        id: 'ledger',
        name: 'Ledger',
        icon: <IconLedger />,
        checkAvailability: () => true,
    },
    {
        id: 'sender',
        name: 'Sender',
        icon: <img src={SenderLogo} alt="Sender Wallet Logo"/>,
        getUrl: ({ hash, networkId }) => `https://sender.org/transfer?keystore=${hash}&network=${networkId}`,
        checkAvailability: () => true,
    },
    {
        id: 'meteor-wallet',
        name: 'Meteor Wallet',
        icon: <img src={ImgMeteorWallet} alt={'Meteor Wallet Logo'}/>,
        getUrl: ({ hash, networkId }) => `${getMeteorWalletUrl()}/batch-import?hash=${hash}&network=${networkId}`,
        checkAvailability: () => true,
    },
    {
        id: 'finer-wallet',
        name: 'FiNER Wallet',
        icon: <img src={ImgFinerWallet} alt="Finer Wallet Logo" />,
        getUrl: ({ hash }) => `finer://wallet.near.org/batch-import#${hash}`,
        checkAvailability: () => isMobile(),
    },
];

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
    cursor: pointer;

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

    &.active {
        background-color: #F0F9FF;
        border-left: solid 4px #2B9AF4;

        :before {
            background-color: #2B9AF4;
            border-color: #2B9AF4;
        }

        :after {
            content: '';
            position: absolute;
            transform: rotate(45deg);
            left: 23px;
            top: 33px;
            height: 11px;
            width: 11px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 1px 0px 2px 0px #0000005;
        }
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

    svg, img {
        height: 48px;
        width: 48px;
        padding: 8px;
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

    &:last-child {
        margin-left: 16px !important;
    }
`;


const SelectDestinationWallet = ({ handleSetActiveView, handleSetWallet, wallet, onClose }) => {
    const dispatch = useDispatch();

    const handleContinue = useCallback(() => {
        handleSetWallet(wallet);
        if (wallet.id === 'ledger') {
            onClose();
            return dispatch(redirectTo('/batch-ledger-export'));
        } else {
            return handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_SECRET);
        }
    }, [wallet, handleSetActiveView, handleSetWallet]);

    return (
        <Modal
            modalClass="slim"
            id='migration-modal'
            isOpen={true}
            disableClose={true}
            modalSize='md'
            style={{ maxWidth: '435px' }}
        >
            <Container>
                <IconWallet/>
                <h4 className='title'><Translate id='walletMigration.selectWallet.title'/></h4>
                <WalletOptionsListing>
                    {WALLET_OPTIONS.map((walletOption) => {
                        if (!walletOption.checkAvailability()) {
                            return null;
                        }
                        return (
                            <WalletOptionsListingItem
                                className={classNames([{ active: walletOption.id === wallet?.id }])}
                                onClick={() => handleSetWallet(walletOption)}
                                key={walletOption.name}
                            >
                                <h4 className='name'>{walletOption.name}</h4>
                                {walletOption.icon}
                            </WalletOptionsListingItem>
                        );
                    })}
                </WalletOptionsListing>
                <ButtonsContainer>
                    <StyledButton className="gray-blue" onClick={onClose}>
                        <Translate id='button.cancel'/>
                    </StyledButton>
                    <StyledButton onClick={handleContinue} disabled={!wallet?.id}>
                        <Translate id='button.continue'/>
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </Modal>
    );
};

export default SelectDestinationWallet;
