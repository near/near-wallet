import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import {useSelector} from 'react-redux';

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
import HereWalletIcon from '../../images/wallet-icons/here-wallet-icon.png';
import MeteorWalletIcon from '../../images/wallet-icons/meteor-wallet-icon.png';
import NearWalletIcon from '../../images/wallet-icons/near-wallet-icon.png';
import NightlyWalletIcon from '../../images/wallet-icons/nightly-wallet-icon.png';
import SenderWalletIcon from '../../images/wallet-icons/sender-wallet-icon.png';
import WellDoneWalletIcon from '../../images/wallet-icons/welldone-wallet-icon.png';
import {selectAvailableAccounts} from '../../redux/slices/availableAccounts';
import FormButton from '../common/FormButton';
import { WalletSelectorGetAWallet } from '../common/wallet_selector/WalletSelectorGetAWallet';
import NavigationWrapperV2 from '../navigation/NavigationWrapperV2';
import {recordWalletMigrationEvent} from '../wallet-migration/metrics';

export function GuestLanding({ history, accountFound, onTransfer  }) {
    const availableAccounts = useSelector(selectAvailableAccounts);

    const [walletSelectorModal, setWalletSelectorModal] = useState();
    const [showModal, setShowModal] = useState();

    return (
        <>
        <NavigationWrapperV2 onTransfer={onTransfer} />
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
                                    recordWalletMigrationEvent('click', { element: { type: 'button', description: 'Learn More' }});
                                    window.open('https://medium.com/nearprotocol/near-opens-the-door-to-more-wallets-255eee58eb97', '_blank');
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
                                    onClick={onTransfer}
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
                                        recordWalletMigrationEvent('click', { element: { type: 'button', description: 'Learn More' }});
                                        window.open('https://medium.com/nearprotocol/near-opens-the-door-to-more-wallets-255eee58eb97', '_blank');
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
                                        recordWalletMigrationEvent('click', { element: { type: 'button', description: 'Transfer Guide' }});
                                        history.push('/transfer-wizard');
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
                                    recordWalletMigrationEvent('click', { element: { type: 'button', description: 'Compare Wallets' }});
                                    window.open('https://docs.google.com/spreadsheets/d/1JeF9ZKmg1IHvTlgIv0ymGNMIeps6khcr3ElfIpEJHGs/edit#gid=0', '_blank');
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
                            <SingleCard href='https://app.mynearwallet.com' target='_blank' onClick={() => {
                                recordWalletMigrationEvent('click', { element: { type: 'link', description: 'MyNearWallet Wallet' }});
                            }}>
                                <img src={NearWalletIcon} alt="near-wallet-icon" />
                                <h3>MyNearWallet</h3>
                                <p><Translate id="landing.wallet.near" /></p>
                            </SingleCard>
                            <SingleCard href="https://wallet.meteorwallet.app" target="_blank" onClick={() => {
                                recordWalletMigrationEvent('click', { element: { type: 'link', description: 'Meteor Wallet' }});
                            }}>
                                <img src={MeteorWalletIcon} alt="meteor-wallet-icon" />
                                <h3>Meteor Wallet</h3>
                                <p><Translate id="landing.wallet.meteor" /></p>
                            </SingleCard>
                            <SingleCard href="https://sender.org" target="_blank" onClick={() => {
                                recordWalletMigrationEvent('click', { element: { type: 'link', description: 'Sender Wallet' }});
                            }}>
                                <img src={SenderWalletIcon} alt="sender-wallet-icon" />
                                <h3>Sender Wallet</h3>
                                <p><Translate id="landing.wallet.sender" /></p>
                            </SingleCard>
                            <SingleCard href="https://www.herewallet.app" target="_blank" onClick={() => {
                                recordWalletMigrationEvent('click', { element: { type: 'link', description: 'HERE Wallet' }});
                            }}>
                                <img src={HereWalletIcon} alt="here-wallet-icon" />
                                <h3>HERE Wallet</h3>
                                <p><Translate id="landing.wallet.here" /></p>
                            </SingleCard>
                            <SingleCard href="https://wallet.nightly.app/download" target="_blank" onClick={() => {
                                recordWalletMigrationEvent('click', { element: { type: 'link', description: 'Nightly Wallet' }});
                            }}>
                                <img src={NightlyWalletIcon} alt="nightly-wallet-icon" />
                                <h3>Nightly Wallet</h3>
                                <p><Translate id="landing.wallet.nightly" /></p>
                            </SingleCard>
                            <SingleCard href="https://welldonestudio.io/">
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
                                <h4>
                                    {availableAccounts.length === 1 ? (
                                        <Translate id="landing.transfer.title_singular"
                                            data={{ accountCount: availableAccounts.length }}
                                        />
                                    ) : (
                                        <Translate
                                            id="landing.transfer.title_plural"
                                            data={{ accountCount: availableAccounts.length }}
                                        />
                                    )}
                                </h4>
                                <p><Translate id="landing.transfer.description" /></p>
                            </div>
                            <FormButtonContainer>
                                <FormButton
                                    onClick={onTransfer}
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
