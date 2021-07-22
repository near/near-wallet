import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import FungibleTokens from '../../services/FungibleTokens';
import classNames from '../../utils/classNames';
import isDecimalString from '../../utils/isDecimalString';
import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';
import EnterReceiver from './components/views/EnterReceiver';
import Review from './components/views/Review';
import SelectToken from './components/views/SelectToken';
import Success from './components/views/Success';

const { getFormattedTokenAmount, getParsedTokenAmount } = FungibleTokens;

export const VIEWS = {
    ENTER_AMOUNT: 'enterAmount',
    SELECT_TOKEN: 'selectToken',
    ENTER_RECEIVER: 'enterReceiver',
    REVIEW: 'review',
    SUCCESS: 'success'
};

const StyledContainer = styled(Container)`
    &&& {
        .header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #272729;
            font-weight: 600;
            font-size: 20px;
            line-break: anywhere;

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
    availableNearBalance,
    reservedNearForFees,
    availableNearToSend,
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
    transactionHash
}) => {
    const [amounts, setAmounts] = useState(
        {
            userInputAmount: '',
            rawAmount: '',
        }
    );
    const [receiverId, setReceiverId] = useState(accountIdFromUrl);
    const [selectedToken, setSelectedToken] = useState(fungibleTokens[0]);

    useEffect(() => {
        // Initial render may not have NEAR available balance loaded yet
        // Anytime NEAR available balance changes, we update the state
        if (selectedToken.symbol === 'NEAR') {
            setSelectedToken(fungibleTokens[0]);
        }
    }, [availableNearBalance]);

    useEffect(() => window.scrollTo(0, 0), [activeView]);
    useEffect(() => setActiveView(VIEWS.ENTER_AMOUNT), [accountId]);

    const isValidAmount = () => {

        return !new BN(amounts.rawAmount).isZero() && new BN(amounts.rawAmount).lte(new BN(selectedToken.balance)) && isDecimalString(amounts.userInputAmount);
        // TODO: Handle rounding issue that can occur entering exact available amount
    };

    const enterAmountIsComplete = () => {
        return amounts.userInputAmount && !new BN(selectedToken.balance).isZero() && isValidAmount();
    };

    const getCurrentViewComponent = (view) => {
        switch (view) {
        case VIEWS.ENTER_AMOUNT:
            return (
                <EnterAmount
                    amount={amounts.userInputAmount}
                    onChangeAmount={(event) => {
                        const { value, maxLength } = event.target;
                        const userInputAmount = value.slice(0, maxLength);

                        setAmounts({
                            userInputAmount,
                            rawAmount: getParsedTokenAmount(userInputAmount, selectedToken.symbol, selectedToken.decimals),
                        });
                    }}
                    onSetMaxAmaount={() => {
                        const formattedTokenAmount = getFormattedTokenAmount(selectedToken.balance, selectedToken.symbol, selectedToken.decimals);

                        if (!new BN(selectedToken.balance).isZero()) {
                            setAmounts({
                                userInputAmount: formattedTokenAmount.replace(/,/g, ''),
                                rawAmount: selectedToken.balance,
                            });
                        }
                    }}
                    availableToSend={selectedToken.balance}
                    availableBalance={availableNearBalance}
                    reservedForFees={reservedNearForFees}
                    continueAllowed={enterAmountIsComplete()}
                    onContinue={() => {
                        setActiveView(VIEWS.ENTER_RECEIVER);
                    }}
                    onClickCancel={() => redirectTo('/')}
                    selectedToken={selectedToken}
                    onClickSelectToken={() => setActiveView(VIEWS.SELECT_TOKEN)}
                    error={amounts.userInputAmount && amounts.userInputAmount !== '0' && !enterAmountIsComplete()}
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
                        setAmounts({
                            userInputAmount: '',
                            rawAmount: '',
                        });
                    }}
                    fungibleTokens={fungibleTokens}
                    availableNearToSend={availableNearToSend}
                />
            );
        case VIEWS.ENTER_RECEIVER:
            return (
                <EnterReceiver
                    onClickGoBack={() => setActiveView(VIEWS.ENTER_AMOUNT)}
                    onClickCancel={() => redirectTo('/')}
                    amount={amounts.rawAmount}
                    selectedToken={selectedToken}
                    handleChangeReceiverId={(receiverId) => setReceiverId(receiverId)}
                    receiverId={receiverId}
                    checkAccountAvailable={checkAccountAvailable}
                    localAlert={localAlert}
                    clearLocalAlert={clearLocalAlert}
                    onClickContinue={() => handleContinueToReview({
                        token: selectedToken,
                        rawAmount: amounts.rawAmount,
                        receiverId
                    })}
                    isMobile={isMobile}
                />
            );
        case VIEWS.REVIEW:
            return (
                <Review
                    onClickCancel={() => redirectTo('/')}
                    amount={amounts.rawAmount}
                    selectedToken={selectedToken}
                    onClickContinue={() => handleSendToken(amounts.rawAmount, receiverId, selectedToken.contractName)}
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
                    tokenSymbol={selectedToken.symbol}
                    amount={amounts.userInputAmount}
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