import React, { useEffect, useRef, useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import ArrowGrnImage from '../../images/icon-arrow-grn.svg';
import ArrowWhiteImage from '../../images/icon-arrow-white.svg';
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
import NavigationWrapperV2 from '../navigation/NavigationWrapperV2';
import { recordWalletMigrationEvent } from '../wallet-migration/metrics';
import {
    CardContainer,
    CardsSection,
    DefaultContainer,
    FlexBox,
    FlexItem,
    FormButtonContainer,
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
    TransferSection,
    TransferSectionWrapper,
} from './GuestLanding.styles';

const CustomButton = styled.button`
    &&& {
        color: #fff;
        margin: ${({ swapButton }) => (swapButton ? 0 : '24px 0 0 0')};
        border: 2px solid;
        font-weight: 600;
        height: 56px;
        border-radius: 30px;
        transition: 100ms;
        font-size: 14px;
        word-break: keep-all;

        :disabled {
            cursor: not-allowed;
        }

        svg {
            width: 16px;
            height: 16px;
            margin: 0 0 -4px 8px;
        }

        &.small {
            width: 110px;
            height: 36px;
            border-radius: 20px;
            padding: 0px 0px;

            font-size: 14px;
        }

        &.black {
            background-color: black;

            :hover {
                background-color: #1f1f1f;
            }
        }

        &.dark-gray {
            background-color: #272729;
            border-color: #272729;

            :hover {
                background-color: black;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #a2a2a8;
            }
        }

        &.dark-gray-light-blue {
            background-color: #37383c;
            border-color: #37383c;
            color: #8ebaf0;

            :hover {
                background-color: black;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #a2a2a8;
            }
        }

        &.dark-gray-black {
            background-color: #000000;
            color: #ffffff;
            padding: 0 20px;
            margin: 0;
            :hover {
                background-color: #706f6c;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #a2a2a8;
            }
        }

        &.gray-gray {
            background-color: #f0f0f1;
            border-color: #f0f0f1;
            color: #3f4045;

            :hover {
                background-color: #ececec;
            }

            :disabled {
                opacity: 0.8;
            }
        }

        &.light-blue {
            background-color: #d6edff;
            border: 0;
            color: #0072ce;
            border-radius: 4px;

            &.small {
                padding: 6px 12px;
                height: auto;
                font-weight: 400 !important;
                font-size: 12px;
            }

            &.rounded {
                border-radius: 50px;
                padding: ${({ swapButton }) =>
    swapButton ? '6px 12px' : '12px 15px'};
                width: auto;
            }

            :hover {
                color: white;
                background-color: #0072ce;
            }

            :disabled {
                background-color: #f0f0f1;
                color: #a2a2a8;
            }
        }

        &.red {
            border-color: #e5484d;
            background: #e5484d;

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                border-color: #e5484d;
                background: #fff;
                color: #e5484d;
            }
            &.dots {
                color: #fff;
            }
        }
        &.blue {
            border-color: #0072ce;
            background: #0072ce;

            :active,
            :hover,
            :focus {
                border-color: #007fe6;
                background: #007fe6;
            }
            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #a2a2a8;
            }
        }
        &.seafoam-blue {
            border-color: #6ad1e3;
            background: #6ad1e3;

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                opacity: 0.8;
            }
        }
        &.seafoam-blue-white {
            border-color: #6ad1e3;
            background: #fff;
            color: #6ad1e3;

            :disabled {
                background: #fff;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                opacity: 0.8;
            }
        }
        &.dark-gray-transparent {
            background-color: transparent;
            border-color: #000000;
            color: #000000;
            margin: 0;
            padding: 10px 24px;

            :hover {
                background-color: #000000;
                color: #ffffff;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #a2a2a8;
            }
        }
        &.dark-green-transparent {
            background-color: transparent;
            border-color: #00ec97;
            color: #ffffff;
            margin: 0;
            padding: 10px 24px;

            :hover {
                background-color: rgb(0, 236, 151);
                color: #000000;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #a2a2a8;
            }
        }
        &.light-green-transparent {
            background-color: #00ec97;
            border-color: #00ec97;
            color: #000000;
            margin: 0;
            padding: 10px 24px;

            :hover {
                background-color: #45e394;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #a2a2a8;
            }
        }
        &.green {
            border-color: #5ace84;
            background: #5ace84;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                border-color: #61de8d;
                background: #61de8d;
            }
        }
        &.green-dark {
            background-color: #00c08b;
            color: #00261c;
            border: 0;
            font-weight: 600 !important;

            :disabled {
                opacity: 0.5;
            }

            &.border {
                color: #008d6a !important;
                background-color: #c8f6e0 !important;
                border: 2px solid #56bc8f !important;
            }
        }
        &.green-white-arrow {
            color: #5ace84;
            border-color: #5ace84;
            background-color: #fff;
            background-image: url(${ArrowGrnImage});
            background-repeat: no-repeat;
            background-position: 90% center;
            background-size: 14px 20px;

            :disabled {
                color: #e6e6e6;
                border-color: #e6e6e6;
                background: #fff;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #fff;
                border-color: #61de8d;
                background-color: #61de8d;
                background-image: url(${ArrowWhiteImage});
            }
        }
        &.green-pastel {
            background-color: #4dd5a6;
            color: #00261c;
            border: 0;

            :hover {
                background-color: #49cc9f;
            }
        }
        &.gray-white {
            color: #cccccc;
            border-color: #cccccc;
            background: #fff;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #fff;
                border-color: #cccccc;
                background: #cccccc;
            }
        }
        &.gray-red {
            color: #ff585d;
            border: none;
            background-color: #f0f0f1;

            :hover,
            :active,
            :focus {
                color: #fff;
                background-color: #ff585d;
            }
        }
        &.gray-blue {
            color: #0072ce;
            border-color: #f0f0f1;
            background: #f0f0f1;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #0072ce;
                border-color: #f0f0f1;
                background: #fff;
            }

            &.dark {
                border-color: #efefef;
                background: #efefef;
            }

            &.border {
                background: none;
                border-color: #e6e5e3;
                :hover {
                    border-color: #0072ce;
                }
            }
        }
        &.white-blue {
            background-color: white;
            border: 0;
            color: #0072ce;

            :active,
            :hover,
            :focus {
                color: white;
                background: #0072ce;
            }
        }
        &.link {
            width: auto !important;
            height: auto;
            min-height: 50px;
            padding: 0;
            margin: 0;
            border-radius: 0px;
            background: none;
            border: none;
            display: inline;
            color: #0072ce;

            :hover,
            :focus {
                color: #0072ce;
                background-color: transparent;
                text-decoration: underline;
            }

            &.gray {
                color: #72727a;

                :hover,
                :focus {
                    color: #72727a;
                }
            }

            &.light-gray {
                color: #a2a2a8;

                :hover,
                :focus {
                    color: #a2a2a8;
                }
            }

            &.red {
                color: #ff585d;

                :disabled {
                    opacity: 0.8;
                    background: transparent !important;
                }
            }

            &.normal {
                font-weight: 400;
                font-size: 16px;
            }

            &.underline {
                font-weight: 400;
                text-decoration: underline;

                :hover {
                    text-decoration: none;
                }
            }
        }

        &.dots {
            color: #fff;
            border-color: #cccccc;
            background-color: #cccccc;
            cursor: default;

            :active,
            :hover,
            :focus,
            :disabled {
                background: #cccccc;
                border-color: #cccccc;
            }
            :after {
                content: ".";
                animation: dots 1s steps(5, end) infinite;

                @keyframes dots {
                    0%,
                    20% {
                        color: rgba(0, 0, 0, 0);
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    40% {
                        color: white;
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    60% {
                        text-shadow: 0.3em 0 0 white, 0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    80%,
                    100% {
                        text-shadow: 0.3em 0 0 white, 0.6em 0 0 white;
                    }
                }
            }
        }

        &.link.dots {
            color: #24272a;
            border: 0;
            background-color: transparent;
            text-transform: lowercase;
            text-decoration: none;

            :active,
            :hover,
            :focus,
            :disabled {
                background: transparent;
                border: 0;
            }
            :after {
                content: ".";
                animation: link 1s steps(5, end) infinite;

                @keyframes link {
                    0%,
                    20% {
                        color: rgba(0, 0, 0, 0);
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    40% {
                        color: #24272a;
                        text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    60% {
                        text-shadow: 0.3em 0 0 #24272a,
                            0.6em 0 0 rgba(0, 0, 0, 0);
                    }
                    80%,
                    100% {
                        text-shadow: 0.3em 0 0 #24272a, 0.6em 0 0 #24272a;
                    }
                }
            }
        }
        &.bold {
            font-weight: 500;
        }
        @media screen and (max-width: 767px) {
            width: 100%;
        }
    }
`;

export function GuestLanding({ history, accountFound, onTransfer }) {
    const [walletSelectorModal, setWalletSelectorModal] = useState();
    const [showModal, setShowModal] = useState();

    const ref = useRef(null);

    useEffect(() => {
        recordWalletMigrationEvent('LANDING_PAGE');
    }, []);

    const scrollToWalletSection = () => {
        ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        const elementTop = ref.current.getBoundingClientRect().top;

        const offset = 100;
        window.scrollBy({ top: elementTop - offset, behavior: 'smooth' });
    };

    return (
        <>
            <NavigationWrapperV2 onTransfer={onTransfer} />
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
                                {accountFound ? (
                                    <FormButton
                                        onClick={onTransfer}
                                        className="light-green-transparent"
                                        color="light-green-transparent"
                                        trackingId="Click create account button"
                                        data-test-id="landingPageCreateAccount"
                                    >
                                        <Translate id="button.transferAccounts" />
                                    </FormButton>
                                ) : (
                                    <CustomButton
                                        onClick={scrollToWalletSection}
                                        className="light-green-transparent"
                                        color="light-green-transparent"
                                        trackingId="Explore Wallets"
                                        data-test-id="Explore Wallets"
                                    >
                                        <Translate id="button.exploreWallets" />
                                    </CustomButton>
                                )}
                                <FormButton
                                    onClick={() => {
                                        window.open(
                                            'https://near.org/',
                                            '_blank'
                                        );
                                    }}
                                    className="dark-gray-transparent"
                                    color="dark-gray-transparent"
                                    data-test-id="landingPageNearOrg"
                                >
                                    <Translate id="button.exploreNEAR" />
                                </FormButton>
                            </MainSectionButtons>
                        </MainSectionInfo>
                    </MainSection>
                </MainContainer>
            </StyledContainer>
            <Section>
                <DefaultContainer>
                    <h2>
                        <Translate id="landing.decentralize" />
                    </h2>
                    <h3>
                        <Translate id="landing.decentralizeSubtitle" />
                    </h3>
                    <FlexBox>
                        <FlexItem accountFound={accountFound}>
                            <h4>
                                <Translate id="landing.landingSectionTitle" />
                            </h4>
                            <p>
                                <Translate id="landing.landingSectionDescription" />
                            </p>
                            <div>
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
                                    data-test-id="landingPageCreateAccount"
                                >
                                    <Translate id="button.learnMore" />
                                </FormButton>
                            </div>
                        </FlexItem>
                        {accountFound && (
                            <FlexItem accountFound={accountFound}>
                                <h4>
                                    <Translate id="landing.landingSectionSubTitle" />
                                </h4>
                                <p>
                                    <Translate id="landing.landingSectionSubDescription" />
                                </p>
                                <FormButton
                                    onClick={() => {
                                        recordWalletMigrationEvent('click', {
                                            element: {
                                                type: 'button',
                                                description: 'Transfer Guide',
                                            },
                                        });
                                        history.push('/transfer-wizard');
                                    }}
                                    className="dark-gray-transparent"
                                    color="dark-gray-transparent"
                                    trackingId="Click create account button"
                                    data-test-id="landingPageCreateAccount"
                                >
                                    <Translate id="button.transferGuide" />
                                </FormButton>
                            </FlexItem>
                        )}
                    </FlexBox>
                    <InfoSection>
                        <div>
                            <div ref={ref}>
                                <SecondaryTitle>
                                    <Translate id="landing.wallet.title" />
                                </SecondaryTitle>
                                {accountFound ? (
                                    <SecondaryText>
                                        {accountFound ? (
                                            <Translate id="landing.wallet.description" />
                                        ) : (
                                            <Translate id="landing.wallet.secondaryDescription" />
                                        )}
                                    </SecondaryText>
                                ) : (
                                    <SecondaryText>
                                        <Translate id="landing.wallet.secondaryDescription" />
                                    </SecondaryText>
                                )}
                            </div>
                        </div>
                        <FormButtonContainer>
                            <FormButton
                                onClick={() => {
                                    recordWalletMigrationEvent('click', {
                                        element: {
                                            type: 'button',
                                            description: 'Compare Wallets',
                                        },
                                    });
                                    window.open(
                                        'https://docs.google.com/spreadsheets/d/1JeF9ZKmg1IHvTlgIv0ymGNMIeps6khcr3ElfIpEJHGs/edit#gid=0',
                                        '_blank'
                                    );
                                }}
                                className="dark-gray-transparent"
                                color="dark-gray-transparent"
                                trackingId="Click create account button"
                                data-test-id="landingPageCreateAccount"
                            >
                                <Translate id="button.compareWallets" />
                            </FormButton>
                        </FormButtonContainer>
                    </InfoSection>
                    <CardsSection>
                        <CardContainer>
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
                        </CardContainer>
                    </CardsSection>
                </DefaultContainer>
            </Section>
            {accountFound && (
                <TransferSection>
                    <DefaultContainer>
                        <TransferSectionWrapper>
                            <div>
                                <h4>
                                    <Translate id="landing.transfer.title" />
                                </h4>
                                <p>
                                    <Translate id="landing.transfer.description" />
                                </p>
                            </div>
                            <FormButtonContainer>
                                <FormButton
                                    onClick={onTransfer}
                                    className="dark-green-transparent"
                                    color="dark-green-transparent"
                                    trackingId="Click create account button"
                                    data-test-id="landingPageCreateAccount"
                                >
                                    <Translate id="button.transferAccounts" />
                                </FormButton>
                            </FormButtonContainer>
                        </TransferSectionWrapper>
                    </DefaultContainer>
                </TransferSection>
            )}
        </>
    );
}
