import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import classNames from '../../utils/classNames';
import isDecimalString from '../../utils/isDecimalString';
import Container from '../common/styled/Container.css';
import EnterAmount from './components/views/EnterAmount';
import EnterReceiver from './components/views/EnterReceiver';
import Review from './components/views/Review';
import SelectToken from './components/views/SelectToken';
import Success from './components/views/Success';

//TODO: Handle min-height when showing top banner
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
    FTMethods,
    availableNearBalance,
    reservedNearForFees,
    availableNearToSend,
    redirectTo,
    fungibleTokens,
    checkAccountAvailable,
    localAlert,
    clearLocalAlert,
    accountId,
    showCustomAlert,
    isMobile,
    explorerUrl,
    showNetworkBanner
}) => {

    const [amount, setAmount] = useState('');
    const [estimatedTotalFees, setEstimatedTotalFees] = useState('0');
    const [estimatedTotalInNear, setEstimatedTotalInNear] = useState('0');
    const [parsedAmount, setParsedAmount] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [transactionHash, setTransactionHash] = useState(null);
    const [view, setView] = useState('enterAmount');
    const [maxAmount, setMaxAmount] = useState(null);
    const [sendingToken, setSendingToken] = useState(false);
    const [selectedToken, setSelectedToken] = useState(fungibleTokens[0]);

    useEffect(() => {
        selectedToken.symbol === 'NEAR' && setSelectedToken(fungibleTokens[0]);
    }, [availableNearToSend]);

    useEffect(() => window.scrollTo(0, 0), [view]);
    useEffect(() => setView('enterAmount'), [accountId]);

    const handleChangeAmount = (userInputAmount) => {
        // FIX: Add block when entering more than max decimals allowed
        setAmount(userInputAmount);
        setParsedAmount(FTMethods.getParsedTokenAmount(userInputAmount, selectedToken.symbol, selectedToken.decimals));
        setMaxAmount(false);
    };

    const handleSetMaxAmount = () => {
        const formattedTokenAmount = FTMethods.getFormattedTokenAmount(selectedToken.balance, selectedToken.symbol, selectedToken.decimals);

        if (!new BN(formattedTokenAmount).isZero()) {
            setMaxAmount(true);
            setAmount(formattedTokenAmount.replace(/,/g, ''));
            setParsedAmount(selectedToken.balance);
        }
    };

    const isValidAmount = () => {
        const parsedTokenAmount = FTMethods.getParsedTokenAmount(amount, selectedToken.symbol, selectedToken.decimals);

        if (maxAmount) {
            return true;
        }

        return !new BN(parsedTokenAmount).isZero() && new BN(parsedTokenAmount).lte(new BN(selectedToken.balance)) && isDecimalString(amount);
        // TODO: Handle rounding issue that can occur entering exact available amount
    };

    const handleContinueToEnterReceiver = () => {
        //TODO: Add amount to URL?
        setView('enterReceiver');
    };

    const handleSelectToken = (token) => {
        //TODO: Add token to URL?
        setSelectedToken(token);
        setView('enterAmount');
        setAmount('');
        setParsedAmount('');
        setMaxAmount(false);
    };

    const enterAmountIsComplete = () => {     
        return amount && !new BN(selectedToken.balance).isZero() && isValidAmount();
    };

    const handleContinueToReview = async () => {
        setView('review');

        if (selectedToken.symbol === 'NEAR') {
            setEstimatedTotalFees(await FTMethods.getEstimatedTotalFees());
            setEstimatedTotalInNear(await FTMethods.getEstimatedTotalNearAmount(parsedAmount));
        } else {
            const totalFees = await FTMethods.getEstimatedTotalFees(selectedToken.contractName, receiverId);
            setEstimatedTotalFees(totalFees);
        }

    };

    const handleSendToken = async () => {
        setSendingToken(true);
        let result;

        try {
            result = await FTMethods.transfer({ 
                contractName: selectedToken.contractName,
                parsedAmount: parsedAmount,
                receiverId
            });
        } catch(e) {
            showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.sendFungibleToken.error',
                errorMessage: e.message,
            });
            setSendingToken('failed');
            throw e;
        }

        setView('success');
        setTransactionHash(result.transaction.hash);
    };

    return (
        <StyledContainer className={classNames(['small-centered', {'showing-banner' : showNetworkBanner }])}>
            {view === 'enterAmount' &&
                <EnterAmount
                    amount={amount}
                    onChangeAmount={handleChangeAmount}
                    onSetMaxAmaount={handleSetMaxAmount}
                    availableToSend={selectedToken.balance}
                    availableBalance={availableNearBalance}
                    reservedForFees={reservedNearForFees}
                    continueAllowed={enterAmountIsComplete()}
                    onContinue={handleContinueToEnterReceiver}
                    onClickCancel={() => redirectTo('/')}
                    selectedToken={selectedToken}
                    onClickSelectToken={() => setView('selectToken')}
                    error={amount && amount !== '0' && !enterAmountIsComplete()}
                    isMobile={isMobile}
                />
            }
            {view === 'selectToken' &&
                <SelectToken
                    onClickGoBack={() => setView('enterAmount')}
                    onSelectToken={handleSelectToken}
                    fungibleTokens={fungibleTokens}
                    availableNearToSend={availableNearToSend}
                />
            }
            {view === 'enterReceiver' &&
                <EnterReceiver
                    onClickGoBack={() => setView('enterAmount')}
                    onClickCancel={() => redirectTo('/')}
                    amount={parsedAmount}
                    selectedToken={selectedToken}
                    handleChangeReciverId={(receiverId) => setReceiverId(receiverId)}
                    receiverId={receiverId}
                    checkAccountAvailable={checkAccountAvailable}
                    localAlert={localAlert}
                    clearLocalAlert={clearLocalAlert}
                    onClickContinue={handleContinueToReview}
                    isMobile={isMobile}
                />
            }
            {view === 'review' &&
                <Review
                    onClickCancel={() => redirectTo('/')}
                    amount={parsedAmount}
                    selectedToken={selectedToken}
                    onClickContinue={handleSendToken}
                    senderId={accountId}
                    receiverId={receiverId}
                    estimatedFeesInNear={estimatedTotalFees}
                    sendingToken={sendingToken}
                    estimatedTotalInNear={estimatedTotalInNear}
                    setView={view => setView(view)}
                />
            }
            {view === 'success' &&
                <Success
                    selectedToken={selectedToken}
                    amount={amount}
                    receiverId={receiverId}
                    onClickContinue={() => redirectTo('/')}
                    onClickGoToExplorer={() => window.open(`${explorerUrl}/transactions/${transactionHash}`, '_blank')}
                />
            }
        </StyledContainer>
    );
};

export default SendContainerV2;