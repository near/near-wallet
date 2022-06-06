import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Mixpanel } from '../../mixpanel/index';
import FungibleTokens from '../../services/FungibleTokens';
import classNames from '../../utils/classNames';
import isDecimalString from '../../utils/isDecimalString';
import { getNearAndFiatValue } from '../common/balance/helpers';
import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';
import EnterReceiver from './components/views/EnterReceiver';
import Review from './components/views/Review';
import SelectToken from './components/views/SelectToken';
import Success from './components/views/Success';

const { getFormattedTokenAmount, getParsedTokenAmount, getUniqueTokenIdentity } = FungibleTokens;

export const VIEWS = {
    ENTER_AMOUNT: 'enterAmount',
    SELECT_TOKEN: 'selectToken',
    ENTER_RECEIVER: 'enterReceiver',
    REVIEW: 'review',
    SUCCESS: 'success'
};

export const StyledContainer = styled(Container)`
    &&& {
        .header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #272729;
            font-weight: 600;
            font-size: 20px;
            word-break: break-all;

            .back-arrow-button {
                position: absolute;
                left: 0;
            }
        }

        .buttons-bottom-buttons {
            margin-top: 55px;

            > button {
                display: block;
                width: 100%;
            }

            .link {
                display: block;
                margin: 20px auto;
            }
        }

        @media (max-width: 500px) {
            .buttons-bottom {
                display: flex;
                flex-direction: column;
                min-height: calc(100vh - 160px);

                .buttons-bottom-buttons {
                    margin-top: auto;
                }
            }

            &.showing-banner {
                .buttons-bottom {
                    min-height: calc(100vh - 218px);
                }
            }
        }
    }
`;

const SendContainerV2 = ({
    redirectTo,
    fungibleTokens,
    checkAccountAvailable,
    localAlert,
    clearLocalAlert,
    accountId,
    isMobile,
    explorerUrl,
    showNetworkBanner,
    accountIdFromUrl,
    activeView,
    setActiveView,
    estimatedTotalFees,
    estimatedTotalInNear,
    handleSendToken,
    handleContinueToReview,
    sendingToken,
    transactionHash,
    nearTokenFiatValueUSD
}) => {
    const [userInputAmount, setUserInputAmount] = useState('');
    const [isMaxAmount, setIsMaxAmount] = useState(false);

    const [receiverId, setReceiverId] = useState(accountIdFromUrl);
    const [selectedToken, setSelectedToken] = useState(fungibleTokens[0]);

    useEffect(() => {
        // fungibleTokens contains balance data for each token -- we need to update local state every time it changes
        // TODO: Add a `byIdentity` reducer for faster lookups than .find()
        let targetToken = fungibleTokens.find(({ contractName }) => 
            (contractName && contractName === selectedToken.contractName)
        ) || fungibleTokens.find(({ onChainFTMetadata }) => 
            onChainFTMetadata?.symbol === selectedToken.onChainFTMetadata?.symbol
        );

        setSelectedToken(targetToken);
    }, [fungibleTokens]);

    useEffect(() => {
        if (isMaxAmount === true) {
            setIsMaxAmount(false);
            setUserInputAmount('');
        }
    }, [getUniqueTokenIdentity(selectedToken)]);

    useEffect(() => window.scrollTo(0, 0), [activeView]);

    useEffect(() => {
        setActiveView(VIEWS.ENTER_AMOUNT);
        setSelectedToken(fungibleTokens[0]);
        setUserInputAmount('');
        setIsMaxAmount(false);
    }, [accountId]);

    const getRawAmount = () => getParsedTokenAmount(userInputAmount, selectedToken.onChainFTMetadata?.symbol, selectedToken.onChainFTMetadata?.decimals);
    const isValidAmount = () => {
        // TODO: Handle rounding issue that can occur entering exact available amount
        if (isMaxAmount === true) {
            return true;
        }

        return !new BN(getRawAmount()).isZero() && new BN(getRawAmount()).lte(new BN(selectedToken.balance)) && isDecimalString(userInputAmount);
    };

    const enterAmountIsComplete = () => {
        return userInputAmount && !new BN(selectedToken.balance).isZero() && isValidAmount();
    };

    const getCurrentViewComponent = (view) => {
        switch (view) {
        case VIEWS.ENTER_AMOUNT:
            return (
                <EnterAmount
                    amount={userInputAmount}
                    rawAmount={getRawAmount()}
                    onChangeAmount={(event) => {
                        const { value: userInputAmount } = event.target;

                        setIsMaxAmount(false);
                        setUserInputAmount(userInputAmount);
                    }}
                    onSetMaxAmount={() => {
                        const formattedTokenAmount = getFormattedTokenAmount(selectedToken.balance, selectedToken.onChainFTMetadata?.symbol, selectedToken.onChainFTMetadata?.decimals);

                        if (!new BN(selectedToken.balance).isZero()) {
                            Mixpanel.track('SEND Use max amount');
                            setIsMaxAmount(true);
                            setUserInputAmount(formattedTokenAmount.replace(/,/g, ''));
                        }
                    }}
                    availableToSend={selectedToken.balance}
                    continueAllowed={enterAmountIsComplete()}
                    onContinue={() => {
                        setActiveView(VIEWS.ENTER_RECEIVER);
                    }}
                    onClickCancel={() => redirectTo('/')}
                    selectedToken={selectedToken}
                    onClickSelectToken={() => setActiveView(VIEWS.SELECT_TOKEN)}
                    error={userInputAmount && userInputAmount !== '0' && !enterAmountIsComplete()}
                    isMobile={isMobile}
                />
            );
        case VIEWS.SELECT_TOKEN:
            return (
                <SelectToken
                    onClickGoBack={() => setActiveView(VIEWS.ENTER_AMOUNT)}
                    onSelectToken={(token) => {
                        setSelectedToken(token);
                        setActiveView(VIEWS.ENTER_AMOUNT);
                    }}
                    fungibleTokens={fungibleTokens}
                    isMobile={isMobile}
                />
            );
        case VIEWS.ENTER_RECEIVER:
            return (
                <EnterReceiver
                    onClickGoBack={() => setActiveView(VIEWS.ENTER_AMOUNT)}
                    onClickCancel={() => redirectTo('/')}
                    amount={isMaxAmount ? selectedToken.balance : getRawAmount()}
                    selectedToken={selectedToken}
                    handleChangeReceiverId={(receiverId) => setReceiverId(receiverId)}
                    receiverId={receiverId}
                    checkAccountAvailable={checkAccountAvailable}
                    localAlert={localAlert}
                    clearLocalAlert={clearLocalAlert}
                    onClickContinue={() => {
                        Mixpanel.track('SEND Click continue to review button');
                        handleContinueToReview({
                            token: selectedToken,
                            rawAmount: getRawAmount(),
                            receiverId
                        });
                    }}
                    isMobile={isMobile}
                />
            );
        case VIEWS.REVIEW:
            return (
                <Review
                    onClickCancel={() => {
                        redirectTo('/');
                        Mixpanel.track('SEND Click cancel button');
                    }}
                    amount={getRawAmount()}
                    selectedToken={selectedToken}
                    onClickContinue={() => handleSendToken(isMaxAmount ? selectedToken.balance : getRawAmount(), receiverId, selectedToken.contractName)}
                    senderId={accountId}
                    receiverId={receiverId}
                    estimatedFeesInNear={estimatedTotalFees}
                    sendingToken={sendingToken}
                    estimatedTotalInNear={estimatedTotalInNear}
                    onClickAmount={() => setActiveView(VIEWS.ENTER_AMOUNT)}
                    onClickReceiver={() => setActiveView(VIEWS.ENTER_RECEIVER)}
                    onClickSelectedToken={() => setActiveView(VIEWS.SELECT_TOKEN)}
                />
            );
        case VIEWS.SUCCESS:
            return (
                <Success
                    amount={
                        selectedToken.onChainFTMetadata?.symbol === 'NEAR'
                        ? getNearAndFiatValue(getRawAmount(), nearTokenFiatValueUSD)
                        : `${userInputAmount} ${selectedToken.onChainFTMetadata?.symbol}`
                    }
                    receiverId={receiverId}
                    onClickContinue={() => redirectTo('/')}
                    onClickGoToExplorer={() => window.open(`${explorerUrl}/transactions/${transactionHash}`, '_blank')}
                />
            );
        default:
            return null;
        }
    };

    return (
        <StyledContainer className={classNames(['small-centered', { 'showing-banner': showNetworkBanner }])}>
            {getCurrentViewComponent(activeView)}
        </StyledContainer>
    );
};

export default SendContainerV2;
