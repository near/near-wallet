import React, { useEffect, useRef, useState } from 'react';
import { Translate } from 'react-localize-redux';

import BitteWalletIcon from '../../images/wallet-icons/bitte-wallet-icon.png';
import HereWalletIcon from '../../images/wallet-icons/here-wallet-icon.png';
import MeteorWalletIcon from '../../images/wallet-icons/meteor-wallet-icon.png';
import NearMobileIcon from '../../images/wallet-icons/near-mobile-icon.png';
import NearWalletIcon from '../../images/wallet-icons/near-wallet-icon.png';
import NightlyWalletIcon from '../../images/wallet-icons/nightly-wallet-icon.png';
import SenderWalletIcon from '../../images/wallet-icons/sender-wallet-icon.png';
import WellDoneWalletIcon from '../../images/wallet-icons/welldone-wallet-icon.png';
import FormButton from '../common/FormButton';
import { WalletSelectorGetAWallet } from '../common/wallet_selector/WalletSelectorGetAWallet';
import { recordWalletMigrationEvent } from '../wallet-migration/metrics';
import {
    CardContainer,
    CardsSection,
    DefaultContainer,
    InfoSection,
    MainContainer,
    MainSection,
    MainSectionButtons,
    MainSectionInfo,
    SecondaryText,
    SecondaryTitle,
    Section,
    SingleCard,
    StyledContainer,
} from './GuestLanding.styles';

export function GuestLanding({ onTransfer }) {
    const [walletSelectorModal, setWalletSelectorModal] = useState();
    const [showModal, setShowModal] = useState();

    const ref = useRef(null);

    useEffect(() => {
        recordWalletMigrationEvent('LANDING_PAGE');
    }, []);

    return (
        <>
            <Section>
                <DefaultContainer>
                    <InfoSection>
                        <div>
                            <div ref={ref}>
                                <SecondaryTitle>
                                    <Translate id="landing.wallet.title" />
                                </SecondaryTitle>
                                <SecondaryText>
                                    <Translate id="landing.wallet.secondaryDescription" />
                                </SecondaryText>
                            </div>
                        </div>
                    </InfoSection>
                    <CardsSection>
                        <CardContainer>
                            <SingleCard
                                href="https://wallet.meteorwallet.app"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'Meteor Wallet',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={MeteorWalletIcon}
                                    alt="meteor-wallet-icon"
                                />
                                <h3>Meteor Wallet</h3>
                                <p>
                                    <Translate id="landing.wallet.meteor" />
                                </p>
                            </SingleCard>
                            <SingleCard
                                href="https://nearmobile.app/"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'NEAR Mobile',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={NearMobileIcon}
                                    alt="near-mobile-icon"
                                />
                                <h3>NEAR Mobile</h3>
                                <p>
                                    <Translate id="landing.wallet.nearMobile" />
                                </p>
                            </SingleCard>
                            <SingleCard
                                href="https://www.herewallet.app"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'HERE Wallet',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={HereWalletIcon}
                                    alt="here-wallet-icon"
                                />
                                <h3>HERE Wallet</h3>
                                <p>
                                    <Translate id="landing.wallet.here" />
                                </p>
                            </SingleCard>
                            <SingleCard
                                href="https://wallet.bitte.ai"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'Bitte Wallet',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={BitteWalletIcon}
                                    alt="bitte-wallet-icon"
                                />
                                <h3>Bitte Wallet</h3>
                                <p>
                                    <Translate id="landing.wallet.bitte" />
                                </p>
                            </SingleCard>
                            <SingleCard
                                href="https://wallet.nightly.app/download"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'Nightly Wallet',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={NightlyWalletIcon}
                                    alt="nightly-wallet-icon"
                                />
                                <h3>Nightly Wallet</h3>
                                <p>
                                    <Translate id="landing.wallet.nightly" />
                                </p>
                            </SingleCard>
                            <SingleCard
                                href="https://welldonestudio.io/"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'WELLDONE Wallet',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={WellDoneWalletIcon}
                                    alt="wellDone-wallet-icon"
                                />
                                <h3>WELLDONE Wallet</h3>
                                <p>
                                    <Translate id="landing.wallet.wellDone" />
                                </p>
                            </SingleCard>
                            <SingleCard
                                href="https://sender.org"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'Sender Wallet',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={SenderWalletIcon}
                                    alt="sender-wallet-icon"
                                />
                                <h3>Sender Wallet</h3>
                                <p>
                                    <Translate id="landing.wallet.sender" />
                                </p>
                            </SingleCard>
                            <SingleCard
                                href="https://mynearwallet.com"
                                target="_blank"
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'link',
                                            description: 'MyNearWallet Wallet',
                                        },
                                    });
                                }}
                            >
                                <img
                                    src={NearWalletIcon}
                                    alt="near-wallet-icon"
                                />
                                <h3>MyNearWallet</h3>
                                <p>
                                    <Translate id="landing.wallet.near" />
                                </p>
                            </SingleCard>
                        </CardContainer>
                    </CardsSection>
                </DefaultContainer>
            </Section>
            <StyledContainer>
                <WalletSelectorGetAWallet
                    setWalletSelectorModal={(modal) =>
                        setWalletSelectorModal(modal)
                    }
                    setShowModal={(modal) => {
                        setShowModal(null);
                        if (modal === 'wallet-selector') {
                            walletSelectorModal.show();
                        }
                    }}
                    showModal={showModal}
                />
                <MainContainer>
                    <MainSection>
                        <MainSectionInfo>
                            <h1>
                                <Translate id="landing.title" />
                            </h1>
                            <h3>
                                <Translate id="landing.desc" />
                            </h3>
                            <MainSectionButtons>
                                <FormButton
                                    onClick={() => {
                                        recordWalletMigrationEvent('click', {
                                            element: {
                                                type: 'button',
                                                description: 'Learn More',
                                            },
                                        });
                                        window.open(
                                            'https://medium.com/nearprotocol/near-opens-the-door-to-more-wallets-255eee58eb97',
                                            '_blank'
                                        );
                                    }}
                                    className="dark-gray-transparent"
                                    color="dark-gray-transparent"
                                    trackingId="Click create account button"
                                    data-test-id="landingPageLearMore"
                                >
                                    <Translate id="button.learnMore" />
                                </FormButton>
                            </MainSectionButtons>
                        </MainSectionInfo>
                    </MainSection>
                </MainContainer>
            </StyledContainer>
        </>
    );
}
