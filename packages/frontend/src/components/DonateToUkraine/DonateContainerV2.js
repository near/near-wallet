import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Mixpanel } from '../../mixpanel/index';
import FungibleTokens from '../../services/FungibleTokens';
import classNames from '../../utils/classNames';
import isDecimalString from '../../utils/isDecimalString';
import { getNearAndFiatValue } from '../common/balance/helpers';
import Container from '../common/styled/Container.css';
import EnterAmount from '../send/components/views/EnterAmount';
import SelectToken from '../send/components/views/SelectToken';
import Success from '../send/components/views//Success';

const { getFormattedTokenAmount, getParsedTokenAmount, getUniqueTokenIdentity } = FungibleTokens;

export const VIEWS = {
    ENTER_AMOUNT: 'enterAmount',
    SELECT_TOKEN: 'selectToken',
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

const DonateContainerV2 = ({
    redirectTo,
    fungibleTokens,
    accountId,
    isMobile,
    explorerUrl,
    showNetworkBanner,
    activeView,
    setActiveView,
    handleSendToken,
    sendingToken,
    transactionHash,
    nearTokenFiatValueUSD
}) => {
    const [userInputAmount, setUserInputAmount] = useState('');
    const [isMaxAmount, setIsMaxAmount] = useState(false);

    const [selectedToken, setSelectedToken] = useState(fungibleTokens[0]);

    useEffect(() => {
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
                    sendingToken={sendingToken}
                    donateToUkraine={true}
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
                        handleSendToken(isMaxAmount ? selectedToken.balance : getRawAmount(), 'ukraine.testnet', selectedToken.contractName);
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
        case VIEWS.SUCCESS:
            return (
                <Success
                    donateToUkraine={true}
                    amount={
                        selectedToken.onChainFTMetadata?.symbol === 'NEAR'
                        ? getNearAndFiatValue(getRawAmount(), nearTokenFiatValueUSD)
                        : `${userInputAmount} ${selectedToken.onChainFTMetadata?.symbol}`
                    }
                    receiverId='ukraine'
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

export default DonateContainerV2;
