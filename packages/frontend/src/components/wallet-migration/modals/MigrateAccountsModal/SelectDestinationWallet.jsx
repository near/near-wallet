import React, { useCallback, useMemo } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, } from 'react-redux';
import styled from 'styled-components';


import ImgFinerWallet from '../../../../../src/images/finer-logo.svg';
import ImgMeteorWallet from '../../../../../src/images/meteor-wallet-logo.svg';
import ImgMyNearWallet from '../../../../../src/images/mynearwallet-cropped.svg';
import SenderLogo from '../../../../../src/images/sender-logo.png';
import IconLedger from '../../../../images/wallet-migration/IconLedger';
import IconWallet from '../../../../images/wallet-migration/IconWallet';
import { redirectTo } from '../../../../redux/actions/account';
import classNames from '../../../../utils/classNames';
import {
    getMeteorWalletUrl,
    getMyNearWalletUrlFromNEARORG
} from '../../../../utils/getWalletURL';
import isMobile from '../../../../utils/isMobile';
import { shuffle } from '../../../../utils/staking';
import Tooltip from '../../../common/Tooltip';
import AlertRoundedIcon from '../../../svg/AlertRoundedIcon.js';
import { WALLET_ID } from '../../../wallet-migration/utils';
import { ButtonsContainer, StyledButton, MigrationModal } from '../../CommonComponents';
import {WALLET_EXPORT_MODAL_VIEWS} from './MigrateAccountsModal';

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

    .description {
        margin-top: 25px;
    }
`;

export const WALLET_OPTIONS = shuffle([
    {
        id: WALLET_ID.MY_NEAR_WALLET,
        name: 'My NEAR Wallet',
        icon: <img src={ImgMyNearWallet} alt="MyNearWallet Logo" />,
        getUrl: ({ hash }) => `${getMyNearWalletUrlFromNEARORG()}/batch-import#${hash}`,
        checkAvailability: () => true,
        ledgerSupport: true,
    },
    {
        id: WALLET_ID.LEDGER,
        name: 'Ledger',
        icon: <IconLedger />,
        checkAvailability: () => true,
        ledgerSupport: true,
    },
    {
        id: WALLET_ID.SENDER,
        name: 'Sender',
        icon: <img src={SenderLogo} alt="Sender Wallet Logo"/>,
        getUrl: ({ hash, networkId }) => `https://sender.org/transfer?keystore=${hash}&network=${networkId}`,
        checkAvailability: () => true,
        ledgerSupport: false,
    },
    {
        id: WALLET_ID.METEOR_WALLET,
        name: 'Meteor Wallet',
        icon: <img src={ImgMeteorWallet} alt={'Meteor Wallet Logo'}/>,
        getUrl: ({ hash, networkId }) => `${getMeteorWalletUrl()}/batch-import?network=${networkId}#${hash}`,
        checkAvailability: () => true,
        ledgerSupport: false,
    },
    {
        id: WALLET_ID.FINER_WALLET,
        name: 'FiNER Wallet',
        icon: <img src={ImgFinerWallet} alt="Finer Wallet Logo" />,
        getUrl: ({ hash, networkId }) => `https://finerwallet.io/near-wallet-${networkId}/batch-import#${hash}`,
        checkAvailability: () => isMobile('iOS'),
        ledgerSupport: false,
    },
]);

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

    &.disabled {
        opacity: 0.5;
        background: #FAFAFA;
        &:hover {
            cursor: not-allowed;
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

const InfoIcon = styled(AlertRoundedIcon)`
    &&& {
        height: 20px;
        width: 20px;
        padding: 0;
        margin-left: 5px;
    }
`;

const LabelContainer = styled.div`
    display: flex;
    align-items: center;
`;

const WalletCategoryLabel = styled.h5`
    text-align: left;
    margin-top: 10px;
`;

const renderWalletOptions = ({ selectedId, handleSetWallet }) => {
    const ledgerSupportedWallets = WALLET_OPTIONS.filter(({ ledgerSupport }) => ledgerSupport);
    const ledgerUnsupportedWallets = WALLET_OPTIONS.filter(({ ledgerSupport }) => !ledgerSupport);

    return (
        <>
            <WalletCategoryLabel><Translate id='walletMigration.selectWallet.ledgerSupported'/></WalletCategoryLabel>
            {
                ledgerSupportedWallets.map((wallet) => {
                    const { id, name, icon, checkAvailability } = wallet;
                    if (!checkAvailability() || id === 'ledger') {
                        return null;
                    }
                    return (
                        <WalletOptionsListingItem
                            key={id}
                            className={classNames({ active: id === selectedId })}
                            onClick={() => handleSetWallet(wallet)}
                        >
                            <LabelContainer>
                                <span className='name'>{name}</span>
                            </LabelContainer>
                            {icon}
                        </WalletOptionsListingItem>
                    );
                })
            }

            <WalletCategoryLabel><Translate id='walletMigration.selectWallet.ledgerUnsupported'/></WalletCategoryLabel>
            {
                ledgerUnsupportedWallets.map((wallet) => {
                    const { id, name, icon, checkAvailability } = wallet;
                    if (!checkAvailability()) {
                        return null;
                    }
                    return (
                        <WalletOptionsListingItem
                            className={classNames({ disabled: true })}
                            key={id}
                        >
                            <LabelContainer>
                                <h4 className='name'>{name}</h4>
                            </LabelContainer>
                            
                            {icon}
                        </WalletOptionsListingItem>
                    );
                })
            }
        </>
    );
};

const SelectDestinationWallet = ({ handleSetActiveView, handleSetWallet, wallet, onClose, accountWithDetails }) => {
    const dispatch = useDispatch();
    
    const handleContinue = useCallback(() => {
        handleSetWallet(wallet);
        if (wallet.id === 'ledger') {
            onClose();
            return dispatch(redirectTo('/batch-ledger-export'));
        } else {
            
            return handleSetActiveView(WALLET_EXPORT_MODAL_VIEWS.MIGRATION_SECRET);
        }
    }, [wallet, handleSetActiveView, handleSetWallet]);

    const hasLedgerAccount = useMemo(() => accountWithDetails.findIndex(({ keyType }) => keyType === 'ledger') > -1, [accountWithDetails.length]);
    const hasFAKAccount = useMemo(() => accountWithDetails.findIndex(({ keyType }) => keyType === 'fullAccessKey') > -1, [accountWithDetails.length]);

    // Use to show warning icon where accounts are both ledger + FAK
    const showWarning = useCallback((ledgerSupport) => {
        if (hasLedgerAccount && hasFAKAccount && !ledgerSupport) {
            return true;
        }
        return false;
    }, [hasLedgerAccount, hasFAKAccount]);

    // Use to disable wallet options where account(s) is/are only ledger
    const disableWalletOption = useCallback((ledgerSupport) => {
        return hasLedgerAccount && !hasFAKAccount && !ledgerSupport;
    }, [hasLedgerAccount, hasFAKAccount]);
    
    return (
        <MigrationModal>
            <Container>
                <IconWallet/>
                <h4 className='title'><Translate id='walletMigration.selectWallet.title'/></h4>
                <h5 className='description'><Translate id='walletMigration.selectWallet.descOne'/></h5>
                
                <WalletOptionsListing>
                    {
                        hasLedgerAccount && !hasFAKAccount
                            ? renderWalletOptions({ selectedId: wallet?.id, handleSetWallet })
                            : WALLET_OPTIONS.map((walletOption) => {
                                if (!walletOption.checkAvailability()) {
                                    return null;
                                }
                                const disabled = disableWalletOption(walletOption.ledgerSupport);
                                const warning = showWarning(walletOption.ledgerSupport);
                                return (
                                    <WalletOptionsListingItem
                                        className={classNames({
                                            active: walletOption.id === wallet?.id,
                                            disabled,
                                        })}
                                        onClick={() => !disabled && handleSetWallet(walletOption)}
                                        key={walletOption.name}
                                    >
                                        <LabelContainer>
                                            <h4 className='name'>{walletOption.name}</h4>
                                            {warning && <Tooltip translate='walletMigration.selectWallet.ledgerDisclaimer'><InfoIcon /></Tooltip>}
                                        </LabelContainer>
                                        
                                        {walletOption.icon}
                                    </WalletOptionsListingItem>
                                );
                            })
                    }
                </WalletOptionsListing>
                <h6 className='description'><Translate id='walletMigration.selectWallet.descTwo'/></h6>
                <ButtonsContainer>
                    <StyledButton className="gray-blue" onClick={onClose}>
                        <Translate id='button.cancel'/>
                    </StyledButton>
                    <StyledButton onClick={handleContinue} disabled={!wallet?.id}>
                        <Translate id='button.continue'/>
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};

export default SelectDestinationWallet;
