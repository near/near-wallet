import React from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';
import { CREATE_IMPLICIT_ACCOUNT,CREATE_USN_CONTRACT } from '../../../../../features';
import classNames from '../../utils/classNames';
import { SHOW_NETWORK_BANNER } from '../../utils/wallet';
import Balance from '../common/balance/Balance';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import Tooltip from '../common/Tooltip';
import DownArrowIcon from '../svg/DownArrowIcon';
import SendIcon from '../svg/SendIcon';
import TopUpIcon from '../svg/TopUpIcon';
import Swap from '../svg/SwapIcon';
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
import { useSplitFungibleTokens } from '../../hooks/splitFungibleTokens';
import { getTotalBalanceInFiat } from '../common/balance/helpers';

const StyledContainer = styled(Container)`
    @media (max-width: 991px) {
        margin: -5px auto 0 auto;
        &.showing-banner {
            margin-top: -15px;
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
                    content: '.';
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
                margin: 20px;
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
`;

export function Wallet({
    tab,
    setTab,
    accountId,
    balance,
    linkdropAmount,
    createFromImplicitSuccess,
    createCustomName,
    fungibleTokensList,
    tokensLoader,
    availableAccounts,
    sortedNFTs,
    handleCloseLinkdropModal,
    handleSetCreateFromImplicitSuccess,
    handleSetCreateCustomName
}) {
    const splitedFungibleTokens = useSplitFungibleTokens(fungibleTokensList, "USN");
    const totalAmount = getTotalBalanceInFiat(splitedFungibleTokens[0])

    return (
        <StyledContainer
            className={SHOW_NETWORK_BANNER ? 'showing-banner' : ''}
        >
            <ReleaseNotesModal />
            <div className='split'>
                <div className='left'>
                    <div className='tab-selector'>
                        <div
                            className={classNames([
                                'tab-balances',
                                tab === 'collectibles' ? 'inactive' : '',
                            ])}
                            onClick={() => setTab('')}
                        >
                            <Translate id='wallet.balances' />
                        </div>
                        <div
                            className={classNames([
                                'tab-collectibles',
                                tab !== 'collectibles' ? 'inactive' : '',
                            ])}
                            onClick={() => setTab('collectibles')}
                        >
                            <Translate id='wallet.collectibles' />
                        </div>
                    </div>
                    {tab === 'collectibles' ? (
                        <NFTs tokens={sortedNFTs} />
                    ) : (
                        <FungibleTokens
                            totalAmount={totalAmount}
                            balance={balance}
                            tokensLoader={tokensLoader}
                            fungibleTokens={CREATE_USN_CONTRACT ? splitedFungibleTokens : fungibleTokensList}
                        />
                    )}
                </div>
                <div className='right'>
                    {CREATE_IMPLICIT_ACCOUNT ? (
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
                    accountId='satoshi.near'
                />
            )}
        </StyledContainer>
    );
}

const FungibleTokens = ({ balance, tokensLoader, fungibleTokens, totalAmount }) => {
    const currentFungibleTokens = CREATE_USN_CONTRACT ? fungibleTokens[0][0] : fungibleTokens[0]
    const availableBalanceIsZero = balance?.balanceAvailable === '0';
    const hideFungibleTokenSection =
        availableBalanceIsZero &&
        fungibleTokens?.length === 1 &&
        currentFungibleTokens?.onChainFTMetadata?.symbol === 'NEAR';
    
    return (
        <>
            <div className='total-balance'>
                <Textfit mode='single' max={48}>
                    <Balance
                        totalAmount={CREATE_USN_CONTRACT ? totalAmount : false}
                        showBalanceInNEAR={false}
                        amount={balance?.balanceAvailable}
                        showAlmostEqualSignUSD={false}
                        showSymbolUSD={false}
                        showSignUSD={true}
                    />
                </Textfit>
            </div>
            <div className='sub-title balance'>
                <Translate id='wallet.availableBalance' />{' '}
                <Tooltip translate='availableBalanceInfo' />
            </div>
            <div className='buttons'>
                <FormButton
                    color='dark-gray'
                    linkTo='/send-money'
                    trackingId='Click Send on Wallet page'
                    data-test-id='balancesTab.send'
                >
                    <div>
                        <SendIcon />
                    </div>
                    <Translate id='button.send' />
                </FormButton>
                <FormButton
                    color='dark-gray'
                    linkTo='/receive-money'
                    trackingId='Click Receive on Wallet page'
                    data-test-id='balancesTab.receive'
                >
                    <div>
                        <DownArrowIcon />
                    </div>
                    <Translate id='button.receive' />
                </FormButton>
                {CREATE_USN_CONTRACT && 
                 <FormButton
                    color='dark-gray'
                    linkTo='/swap-money'
                    trackingId='Click Receive on Wallet page'
                    data-test-id='balancesTab.buy'
                >
                    <div>
                        <Swap />
                    </div>
                    <Translate id='button.swap' />
                </FormButton>}    
                <FormButton
                    color='dark-gray'
                    linkTo='/buy'
                    trackingId='Click Receive on Wallet page'
                    data-test-id='balancesTab.buy'
                >
                    <div>
                        <TopUpIcon />
                    </div>
                    <Translate id='button.topUp' />
                </FormButton>
            </div>
            {availableBalanceIsZero && <DepositNearBanner />}
            {!hideFungibleTokenSection && (
                <>
                    <div className='sub-title tokens'>
                        <span className={classNames({ dots: tokensLoader })}>
                            <Translate id='wallet.yourPortfolio' />
                        </span>
                        {!CREATE_USN_CONTRACT &&
                            <span>
                                <Translate id='wallet.tokenBalance' />
                            </span>
                        }  
                    </div>
                    <Tokens tokens={fungibleTokens[0]} />
                    {CREATE_USN_CONTRACT && (
                        <>
                            <div className='sub-title tokens'>
                                <span
                                    className={classNames({
                                        dots: tokensLoader,
                                    })}
                                >
                                    <Translate id='wallet.OthersTokens' />
                                </span>
                            </div>
                            <Tokens tokens={fungibleTokens[1]} />
                        </>
                    )}
                </>
            )}
        </>
    );
};
