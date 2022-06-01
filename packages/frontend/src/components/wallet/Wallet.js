import React from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';

import {
    CREATE_USN_CONTRACT,
} from '../../../../../features';
import getCurrentLanguage from '../../hooks/getCurrentLanguage';
import classNames from '../../utils/classNames';
import { SHOW_NETWORK_BANNER } from '../../utils/wallet';
import Balance from '../common/balance/Balance';
import { getTotalBalanceInFiat } from '../common/balance/helpers';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import Tooltip from '../common/Tooltip';
import DownArrowIcon from '../svg/DownArrowIcon';
import SendIcon from '../svg/SendIcon';
import TopUpIcon from '../svg/TopUpIcon';
import WrapIcon from '../svg/WrapIcon';
import ActivitiesWrapper from './ActivitiesWrapper';
import CreateCustomNameModal from './CreateCustomNameModal';
import CreateFromImplicitSuccessModal from './CreateFromImplicitSuccessModal';
import DepositNearBanner from './DepositNearBanner';
import ExploreApps from './ExploreApps';
import LinkDropSuccessModal from './LinkDropSuccessModal';
import NFTs from './NFTs';
import ReleaseNotesModal from './ReleaseNotesModal';
import Sidebar from './Sidebar';
import Tokens from './Tokens';

const StyledContainer = styled(Container)`
    @media (max-width: 991px) {
        margin: -5px auto 0 auto;
        &.showing-banner {
            margin-top: -15px;
        }
    }
    
    .coingecko {
        color: #B4B4B4;
        align-self: end;
        margin: 20px;
        @media (max-width: 991px) {
            margin: -25px 0 25px 0;
        }
    }

    .sub-title {
        font-size: 14px;
        margin-bottom: 10px;

        &.balance {
            color: #a2a2a8;
            margin-top: 0;
            display: flex;
            align-items: center;
        }

        &.tokens {
            color: #72727a;
            margin-top: 20px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: unset;

            @media (min-width: 768px) {
                padding: 0 20px;
            }

            .dots {
                :after {
                    position: absolute;
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
        }
    }

    .left {
        display: flex;
        flex-direction: column;
        align-items: center;

        > svg {
            margin-top: 25px;
        }

        .total-balance {
            margin: 40px 0 10px 0;
            width: 100%;
            font-weight: 600;
            text-align: center;
            color: #24272a;
        }

        @media (min-width: 992px) {
            border: 2px solid #f0f0f0;
            border-radius: 8px;
            height: max-content;
        }

        .buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 30px 0;
            width: 100%;
            flex-wrap: wrap;
            margin: 30px -14px;
            width: calc(100% + 28px);

            @media (min-width: 992px) {
                margin-left: 0;
                margin-right: 0;
                width: 100%;
            }

            button {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: auto;
                height: auto;
                background-color: transparent !important;
                border: 0;
                padding: 0;
                color: #3f4045;
                font-weight: 400;
                font-size: 14px;
                margin: 20px 18px;
                border-radius: 0;

                :hover {
                    color: #3f4045;

                    > div {
                        background-color: black;
                    }
                }

                > div {
                    background-color: #272729;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 56px;
                    height: 56px;
                    min-width: 56px;
                    width: 56px;
                    border-radius: 20px;
                    margin-bottom: 10px;
                    transition: 100ms;
                }

                svg {
                    width: 22px !important;
                    height: 22px !important;
                    margin: 0 !important;

                    path {
                        stroke: white;
                    }
                }
            }
        }

        .tab-selector {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            > div {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 25px 0;
                border-bottom: 1px solid transparent;
                color: black;
                font-weight: 600;
                font-size: 16px;

                &.inactive {
                    background-color: #fafafa;
                    border-bottom: 1px solid #f0f0f1;
                    cursor: pointer;
                    color: #a2a2a8;
                    transition: color 100ms;

                    :hover {
                        color: black;
                    }
                }
            }

            .tab-balances {
                border-right: 1px solid transparent;

                @media (max-width: 767px) {
                    margin-left: -14px;
                }

                @media (min-width: 992px) {
                    border-top-left-radius: 8px;
                }

                &.inactive {
                    border-right: 1px solid #f0f0f1;
                }
            }

            .tab-collectibles {
                border-left: 1px solid transparent;

                @media (max-width: 767px) {
                    margin-right: -14px;
                }

                @media (min-width: 992px) {
                    border-top-right-radius: 8px;
                }

                &.inactive {
                    border-left: 1px solid #f0f0f1;
                }
            }
        }
    }

    button {
        &.gray-blue {
            width: 100% !important;
            margin-top: 35px !important;
        }
    }

    h2 {
        font-weight: 900;
        font-size: 22px;
        align-self: flex-start;
        margin: 50px 0 30px 0;
        text-align: left;
        color: #24272a;
    }

    .deposit-banner-wrapper {
        width: 100%;
        .deposit-near-banner {
            > div {
                border-top: 1px solid #F0F0F1;
                padding: 20px;
        
                @media (max-width: 991px) {
                    margin: 0 -14px;
                    padding: 20px 0;
                    border-bottom: 15px solid #F0F0F1;
                }
        
                @media (max-width: 767px) {
                    padding: 20px 14px 20px 14px;
                }
            }
        }
    }
`;

export function Wallet({
    tab,
    setTab,
    accountId,
    accountExists,
    balance,
    linkdropAmount,
    createFromImplicitSuccess,
    createCustomName,
    fungibleTokensList,
    tokensLoading,
    availableAccounts,
    sortedNFTs,
    handleCloseLinkdropModal,
    handleSetCreateFromImplicitSuccess,
    handleSetCreateCustomName,
}) {
    const currentLanguage = getCurrentLanguage();
    const totalAmount = getTotalBalanceInFiat(
        fungibleTokensList,
        currentLanguage
    );

    return (
        <StyledContainer
            className={SHOW_NETWORK_BANNER ? 'showing-banner' : ''}
        >
            <ReleaseNotesModal />
            <div className="split">
                <div className="left">
                    <div className="tab-selector">
                        <div
                            className={classNames([
                                'tab-balances',
                                tab === 'collectibles' ? 'inactive' : '',
                            ])}
                            onClick={() => setTab('')}
                        >
                            <Translate id="wallet.balances" />
                        </div>
                        <div
                            className={classNames([
                                'tab-collectibles',
                                tab !== 'collectibles' ? 'inactive' : '',
                            ])}
                            onClick={() => setTab('collectibles')}
                        >
                            <Translate id="wallet.collectibles" />
                        </div>
                    </div>
                    {tab === 'collectibles' ? (
                        <NFTs tokens={sortedNFTs} />
                    ) : (
                        <FungibleTokens
                            currentLanguage={currentLanguage}
                            totalAmount={totalAmount}
                            balance={balance}
                            tokensLoading={tokensLoading}
                            fungibleTokens={fungibleTokensList}
                            accountExists={accountExists}
                        />
                    )}
                </div>
                <div className="right">
                    {accountExists ? (
                        <Sidebar availableAccounts={availableAccounts} />
                    ) : (
                        <ExploreApps />
                    )}
                    <ActivitiesWrapper />
                </div>
            </div>
            {linkdropAmount !== '0' && (
                <LinkDropSuccessModal
                    onClose={handleCloseLinkdropModal}
                    linkdropAmount={linkdropAmount}
                />
            )}
            {createFromImplicitSuccess && (
                <CreateFromImplicitSuccessModal
                    onClose={handleSetCreateFromImplicitSuccess}
                    isOpen={createFromImplicitSuccess}
                    accountId={accountId}
                />
            )}
            {createCustomName && (
                <CreateCustomNameModal
                    onClose={handleSetCreateCustomName}
                    isOpen={createCustomName}
                    accountId="satoshi.near"
                />
            )}
        </StyledContainer>
    );
}

const FungibleTokens = ({
    balance,
    tokensLoading,
    fungibleTokens,
    accountExists,
    totalAmount,
    currentLanguage,
}) => {
    const zeroBalanceAccount = accountExists === false;
    const currentFungibleTokens = fungibleTokens[0];
    const hideFungibleTokenSection =
        zeroBalanceAccount &&
        fungibleTokens?.length === 1 &&
        currentFungibleTokens?.onChainFTMetadata?.symbol === 'NEAR';

    return (
        <>
            <div className="total-balance">
                <Textfit mode="single" max={48}>
                    <Balance
                        totalAmount={totalAmount}
                        showBalanceInNEAR={false}
                        amount={balance?.balanceAvailable}
                        showAlmostEqualSignUSD={false}
                        showSymbolUSD={false}
                        showSignUSD={true}
                    />
                </Textfit>
            </div>
            <div className="sub-title balance">
                <Translate id="wallet.availableBalance" />{' '}
                <Tooltip translate="availableBalanceInfo" />
            </div>
            <div className="buttons">
                <FormButton
                    color="dark-gray"
                    linkTo="/send-money"
                    trackingId="Click Send on Wallet page"
                    data-test-id="balancesTab.send"
                >
                    <div>
                        <SendIcon />
                    </div>
                    <Translate id="button.send" />
                </FormButton>
                <FormButton
                    color="dark-gray"
                    linkTo="/receive-money"
                    trackingId="Click Receive on Wallet page"
                    data-test-id="balancesTab.receive"
                >
                    <div>
                        <DownArrowIcon />
                    </div>
                    <Translate id="button.receive" />
                </FormButton>
                <FormButton
                    color="dark-gray"
                    linkTo="/buy"
                    trackingId="Click Receive on Wallet page"
                    data-test-id="balancesTab.buy"
                >
                    <div>
                        <TopUpIcon />
                    </div>
                    <Translate id="button.topUp" />
                </FormButton>
                <FormButton
                    color="dark-gray"
                    linkTo="/swap"
                    trackingId="Click Swap on Wallet page"
                    data-test-id="balancesTab.swap"
                >
                    <div>
                        <WrapIcon color="white" />
                    </div>
                    <Translate id="button.swap" />
                </FormButton>
            </div>
            {zeroBalanceAccount &&
                <div className='deposit-banner-wrapper'>
                    <DepositNearBanner />
                </div>
            }
            {!hideFungibleTokenSection && (
                <>
                    <div className="sub-title tokens">
                        <span className={classNames({ dots: tokensLoading })}>
                            <Translate id="wallet.yourPortfolio" />
                        </span>
                        {!CREATE_USN_CONTRACT && (
                            <span>
                                <Translate id="wallet.tokenBalance" />
                            </span>
                        )}
                    </div>
                    <Tokens
                        tokens={fungibleTokens}
                        currentLanguage={currentLanguage}
                    />
                    <div className='coingecko'><Translate id='poweredByCoinGecko'/></div>
                </>
            )}
        </>
    );
};
