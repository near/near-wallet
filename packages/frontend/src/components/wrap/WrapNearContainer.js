import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Mixpanel } from '../../mixpanel/index';
import FungibleTokens from '../../services/FungibleTokens';
import classNames from '../../utils/classNames';
import isDecimalString from '../../utils/isDecimalString';
import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';
import Review from './components/views/Review';
import Success from './components/views/Success';



const { getFormattedTokenAmount, getParsedTokenAmount } = FungibleTokens;

export const VIEWS = {
    ENTER_AMOUNT: 'enterAmount',
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

const WrapNearContainer = ({
    nearToken,
    wNearToken,
    activeView,
    redirectTo,
    accountId,
    showNetworkBanner,
    setActiveView,
    isWrapping,
    handleWrapToken,
    estimatedTotalFees,
    estimatedTotalInNear,
    executionStatus,
    explorerUrl,
    transactionHash,
    setIsWrapping,
    handleContinueToReview,
    isMobile
}) => {


    const [userInputAmount, setUserInputAmount] = useState('');

    let tokenPair = isWrapping ? [nearToken, wNearToken] : [wNearToken, nearToken];
    const selectedToken = tokenPair[0];
    const receiveToken = tokenPair[1];

    const [isMaxAmount, setIsMaxAmount] = useState(false);

    useEffect(() => {
        if (isMaxAmount === true) {
            setIsMaxAmount(false);
            setUserInputAmount('');
        }
    }, [selectedToken]);

    useEffect(() => window.scrollTo(0, 0), [activeView]);

    useEffect(() => {
        setActiveView(VIEWS.ENTER_AMOUNT);
        setUserInputAmount('');
        setIsMaxAmount(false);
    }, [accountId]);

    const getRawAmount = () => {
        return isMaxAmount ? selectedToken.balance : getParsedTokenAmount(userInputAmount, selectedToken.symbol, selectedToken.decimals)
    }
    const isValidAmount = () => {
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
                        onChangeAmount={(event) => {
                            const { value } = event.target;
                            setIsMaxAmount(false);
                            setUserInputAmount(value);
                        }}
                        onSetMaxAmount={() => {
                            const formattedTokenAmount = getFormattedTokenAmount(selectedToken.balance, selectedToken.symbol, selectedToken.decimals);

                            if (!new BN(selectedToken.balance).isZero()) {
                                Mixpanel.track("Wrap Near Use max amount");
                                setIsMaxAmount(true);
                                setUserInputAmount(formattedTokenAmount.replace(/,/g, ''));
                            }
                        }}
                        continueAllowed={enterAmountIsComplete()}
                        onContinue={() => {
                            Mixpanel.track("Wrap Near Click continue to review button");
                            handleContinueToReview({ token: selectedToken, rawAmount: getRawAmount() })
                        }}
                        onClickCancel={() => redirectTo('/')}
                        tokenPair={tokenPair}
                        onSwapClick={() => { setIsWrapping(!isWrapping) }}
                        error={userInputAmount && userInputAmount !== '0' && !enterAmountIsComplete()}
                        isMobile={isMobile}
                    />
                );

            case VIEWS.REVIEW:
                return (
                    <Review
                        onClickCancel={() => {
                            redirectTo('/');
                            Mixpanel.track("Wrap Near Click cancel button");
                        }}
                        amount={getRawAmount()}
                        receiveRawAmount={getRawAmount()}
                        selectedToken={selectedToken}
                        receiveToken={receiveToken}
                        onClickContinue={() => handleWrapToken(isMaxAmount ? selectedToken.balance : getRawAmount())}
                        senderId={accountId}
                        estimatedFeesInNear={estimatedTotalFees}
                        wrappingToken={isWrapping}
                        executionStatus={executionStatus}
                        estimatedTotalInNear={estimatedTotalInNear}
                        onClickAmount={() => setActiveView(VIEWS.ENTER_AMOUNT)}
                    />
                );
            case VIEWS.SUCCESS:
                return (
                    <Success
                        amountStr={
                            `${userInputAmount} ${selectedToken.symbol}`
                        }
                        receiveAmountStr={
                            `${userInputAmount} ${receiveToken.symbol}`
                        }
                        isWrapping={isWrapping}
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

export default WrapNearContainer;