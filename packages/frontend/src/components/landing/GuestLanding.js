import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import {
    CardContainer,
    CardsSection,
    DefaultContainer, FlexBox, FlexItem, FormButtonContainer, InfoSection,
    MainContainer,
    MainSection, MainSectionButtons,
    MainSectionInfo, SecondaryText, SecondaryTitle,
    Section, SingleCard,
    StyledContainer, TransferSection, TransferSectionWrapper
} from './GuestLanding.styles';
import { WEP_DISABLE_ACCOUNT_CREATION } from '../../../../../features';
import HereWalletIcon from '../../images/wallet-icons/here-wallet-icon.png';
import MeteorWalletIcon from '../../images/wallet-icons/meteor-wallet-icon.png';
import NearWalletIcon from '../../images/wallet-icons/near-wallet-icon.png';
import NightlyWalletIcon from '../../images/wallet-icons/nightly-wallet-icon.png';
import SenderWalletIcon from '../../images/wallet-icons/sender-wallet-icon.png';
import WellDoneWalletIcon from '../../images/wallet-icons/welldone-wallet-icon.png';
import FormButton from '../common/FormButton';
import { WalletSelectorGetAWallet } from '../common/wallet_selector/WalletSelectorGetAWallet';
import NavigationWrapperV2 from '../navigation/NavigationWrapperV2';

export function GuestLanding({ history, accountFound  }) {
    const [walletSelectorModal, setWalletSelectorModal] = useState();
    const [showModal, setShowModal] = useState();

    console.log(accountFound,'account existss');

    return (
        <>
        <NavigationWrapperV2 />
        <StyledContainer>
            <WalletSelectorGetAWallet
                setWalletSelectorModal={(modal) => setWalletSelectorModal(modal)}
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
                        <h1><Translate id='landing.title' /></h1>
                        <h3><Translate id='landing.desc' /></h3>
                        <MainSectionButtons>
                            <FormButton
                                onClick={() => {
                                    if (WEP_DISABLE_ACCOUNT_CREATION) {
                                        setShowModal('more-near-wallets');
                                    } else {
                                        history.push('/create');
                                    }
                                }}
                                className='dark-gray-transparent'
                                color='dark-gray-transparent'
                                trackingId="Click create account button"
                                data-test-id="landingPageLearMore"
                            >
                                <Translate id="button.learnMore" />
                            </FormButton>
                            {accountFound && (
                                <FormButton
                                    onClick={() => {
                                        if (WEP_DISABLE_ACCOUNT_CREATION) {
                                            setShowModal('more-near-wallets');
                                        } else {
                                            history.push('/create');
                                        }
                                    }}
                                    className='light-green-transparent'
                                    color='light-green-transparent'
                                    trackingId="Click create account button"
                                    data-test-id="landingPageCreateAccount"
                                >
                                    <Translate id="button.transferAccounts" />
                                </FormButton>
                            )}
                        </MainSectionButtons>
                    </MainSectionInfo>
                </MainSection>
            </MainContainer>
        </StyledContainer>
            <Section>
                <DefaultContainer>
                    <h2><Translate id="landing.decentralize" /></h2>
                    <h3><Translate id="landing.decentralizeSubtitle" /></h3>
                    <FlexBox>
                        <FlexItem accountFound={accountFound}>
                            <h4><Translate id="landing.landingSectionTitle" /></h4>
                            <p>
                                <Translate id="landing.landingSectionDescription" />
                            </p>
                            <div>
                                <FormButton
                                    onClick={() => {
                                        if (WEP_DISABLE_ACCOUNT_CREATION) {
                                            setShowModal('more-near-wallets');
                                        } else {
                                            history.push('/create');
                                        }
                                    }}
                                    className='dark-gray-transparent'
                                    color='dark-gray-transparent'
                                    trackingId="Click create account button"
                                    data-test-id="landingPageCreateAccount"
                                >
                                    <Translate id="button.learnMore" />
                                </FormButton>
                            </div>
                        </FlexItem>
                        { accountFound && (
                            <FlexItem accountFound={accountFound}>
                                <h4><Translate id="landing.landingSectionSubTitle" /></h4>
                                <p>
                                    <Translate id="landing.landingSectionSubDescription" />
                                </p>
                                <FormButton
                                    onClick={() => {
                                        if (WEP_DISABLE_ACCOUNT_CREATION) {
                                            setShowModal('more-near-wallets');
                                        } else {
                                            history.push('/create');
                                        }
                                    }}
                                    className='dark-gray-transparent'
                                    color='dark-gray-transparent'
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
                            <SecondaryTitle><Translate id="landing.wallet.title" /></SecondaryTitle>
                            {accountFound ? (
                                <SecondaryText>
                                    {accountFound ? <Translate id="landing.wallet.description" /> : <Translate id="landing.wallet.secondaryDescription" />}
                                </SecondaryText>
                            ) : (
                                <SecondaryText>
                                    <Translate id="landing.wallet.secondaryDescription" />
                                </SecondaryText>
                            )}
                        </div>
                        <FormButtonContainer>
                            <FormButton
                                onClick={() => {
                                    if (WEP_DISABLE_ACCOUNT_CREATION) {
                                        setShowModal('more-near-wallets');
                                    } else {
                                        history.push('/create');
                                    }
                                }}
                                className='dark-gray-transparent'
                                color='dark-gray-transparent'
                                trackingId="Click create account button"
                                data-test-id="landingPageCreateAccount"
                            >
                                <Translate id="button.compareWallets" />
                            </FormButton>
                        </FormButtonContainer>
                    </InfoSection>
                    <CardsSection>
                        <CardContainer>
                            <SingleCard to={'/'}>
                                <img src={NearWalletIcon} alt="near-wallet-icon" />
                                <h3>MyNearWallet</h3>
                                <p><Translate id="landing.wallet.near" /></p>
                            </SingleCard>
                            <SingleCard to={'/'}>
                                <img src={MeteorWalletIcon} alt="meteor-wallet-icon" />
                                <h3>Meteor Wallet</h3>
                                <p><Translate id="landing.wallet.meteor" /></p>
                            </SingleCard>
                            <SingleCard to={'/'}>
                                <img src={SenderWalletIcon} alt="sender-wallet-icon" />
                                <h3>Sender Wallet</h3>
                                <p><Translate id="landing.wallet.sender" /></p>
                            </SingleCard>
                            <SingleCard to={'/'}>
                                <img src={HereWalletIcon} alt="here-wallet-icon" />
                                <h3>HERE Wallet</h3>
                                <p><Translate id="landing.wallet.here" /></p>
                            </SingleCard>
                            <SingleCard to={'/'}>
                                <img src={NightlyWalletIcon} alt="nightly-wallet-icon" />
                                <h3>Nightly Wallet</h3>
                                <p><Translate id="landing.wallet.nightly" /></p>
                            </SingleCard>
                            <SingleCard to={'/'}>
                                <img src={WellDoneWalletIcon} alt="wellDone-wallet-icon" />
                                <h3>WELLDONE Wallet</h3>
                                <p><Translate id="landing.wallet.wellDone" /></p>
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
                                <h4><Translate id="landing.transfer.title" /></h4>
                                <p><Translate id="landing.transfer.description" /></p>
                            </div>
                            <FormButtonContainer>
                                <FormButton
                                    onClick={() => {
                                        if (WEP_DISABLE_ACCOUNT_CREATION) {
                                            setShowModal('more-near-wallets');
                                        } else {
                                            history.push('/create');
                                        }
                                    }}
                                    className='dark-green-transparent'
                                    color='dark-green-transparent'
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
