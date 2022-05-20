import { parseNearAmount } from 'near-api-js/lib/utils/format';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { EXPLORER_URL } from '../../config';
import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { usePerformBuyOrSellUSN } from '../../hooks/performBuyOrSellUSN';
import { Mixpanel } from '../../mixpanel/index';
import { showCustomAlert } from '../../redux/actions/status';
import { selectAccountId } from '../../redux/slices/account';
import { actions as ledgerActions } from '../../redux/slices/ledger';
import { fetchMultiplier, selectMetadataSlice } from '../../redux/slices/multiplier';
import {
    actions as tokensActions,
    selectTokensLoading,
} from '../../redux/slices/tokens';
import { fungibleTokensService } from '../../services/FungibleTokens';
import isMobile from '../../utils/isMobile';
import { validateInput } from '../../utils/wrap-unwrap';
import Container from '../common/styled/Container.css';
import SelectToken from '../send/components/views/SelectToken';
import { findTokenSwapToList, exchangeRateTranslation, useInterval, commission } from './components/helpers';
import Success from './components/Success';
import { SwapAmountForm } from './components/SwapAmountForm';
import { SwapReviewForm } from './components/SwapReviewForm';

const { fetchTokens } = tokensActions;
const { checkAndHideLedgerModal } = ledgerActions;

export const VIEWS = {
    SWAP_AMOUNT: 'swapAmount',
    SELECT_TOKEN_TO: 'selectTokenTo',
    SELECT_TOKEN_FROM: 'selectTokenFrom',
    REVIEW: 'review',
    SUCCESS: 'success',
};

export const W_NEAR_PROPS = {
    balance: '0',
    onChainFTMetadata: {
        decimals: 24,
        spec: 'ft-1.0.0',
        name: 'Wrapped NEAR fungible token',
        symbol: 'wNEAR',
        icon: null,
        reference: null,
        reference_hash: null
    },
};

export const VALID_TOKEN_PAIRS = {
    NEAR: ['wNEAR', 'USN'],
    USN: ['NEAR'],
    wNEAR: ['NEAR']
};

const StyledContainer = styled(Container)`
    position: relative;

    button {
        display: block !important;

        svg {
            width: initial !important;
            height: initial !important;
            margin: initial !important;
        }
    }

    h3 {
        margin-top: 50px;
    }

    h4 {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        font-weight: 900;
        margin: auto;
        white-space: nowrap;
    }
    div.header {
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
    div.headerSwap {
        display: grid;
        grid-template-columns: repeat(3, 1fr)
    }
    div.flexCenter {
        display: flex;
        justify-content: center;
    }
    div.flexCenterColumn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    div.flexCenterButton {
        display: flex;
        justify-content: center;
        margin-top:28px;
    }

    
    }
`;

function Swap({ history }) {
    const fungibleTokensList = useFungibleTokensIncludingNEAR();
    const accountId = useSelector(selectAccountId);
    const multiplierResult = useSelector(selectMetadataSlice);
    const [multiplier, setMultiplier] = useState(0);
    const [amountTokenFrom, setAmountTokenFrom] = useState(0);
    const [amountTokenTo, setAmountTokenTo] = useState(0);
    const [mockRateData, setMockRateData] = useState(1);
    const [maxFrom, setMaxFrom] = useState({ fullNum: '0', numToShow: '0' });
    const [maxTo, setMaxTo] = useState({ fullNum: '0', numToShow: '0' });
    const [amountError, setAmountError] = useState(false);
    const [activeView, setActiveView] = useState(VIEWS.SWAP_AMOUNT);
    const [activeTokenFrom, setActiveTokenFrom] = useState();
    const [activeTokenTo, setActiveTokenTo] = useState();
    const [swappingToken, setSwappingToken] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const [reversePositionsJustClicked, setReversePositionsJustClicked] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        // setsMultiplier as multiplierResult gets populated
        setMultiplier(multiplierResult);
    }, [multiplierResult]);
    useInterval(() => {
        // callback of fetchMultiplier every 30 seconds
        dispatch(fetchMultiplier());
    }, 30000);

    const tokensLoader =
        useSelector((state) => selectTokensLoading(state, { accountId })) ||
        false;
    useEffect(() => {
        if (!accountId) {
            return;
        }
        dispatch(fetchTokens({ accountId }));
        dispatch(fetchMultiplier());
    }, [accountId]);

    useEffect(() => window.scrollTo(0, 0), [activeView]);

    useEffect(() => {
        fungibleTokensList.find((token) => {
            if (token.onChainFTMetadata?.symbol === 'NEAR') {
                setActiveTokenFrom(token);
            }
        });
        fungibleTokensList.find((token) => {
            if (token.onChainFTMetadata?.symbol === 'wNEAR') {
                setActiveTokenTo(token);
            } else {
                setActiveTokenTo(W_NEAR_PROPS);
            }
        });
    }, [tokensLoader, fungibleTokensList[0].balance]);


    const formatMultiplier = +multiplier / 10000;
    
    const checkValidInput = useCallback(
        () => 
            amountTokenFrom && setAmountError(!validateInput(amountTokenFrom.toString(), maxFrom.fullNum))
    , [amountTokenFrom, maxFrom]);

    useEffect(() => {
        const convertedAmount = exchangeRateTranslation({
            inputtedAmountOfToken: activeTokenFrom,
            calculateAmountOfToken: activeTokenTo,
            balance: amountTokenFrom,
            exchangeRate: formatMultiplier
        });
        setAmountTokenTo(convertedAmount);
        checkValidInput();
    }, [amountTokenFrom, maxFrom]);

    const validTokensSwapFrom = fungibleTokensList.reduce((accum, current) => {
        if (current.onChainFTMetadata.symbol in VALID_TOKEN_PAIRS) {
            accum.push(current);
        }
        return accum;
    }, []);
    const currentToken = activeTokenFrom && activeTokenFrom.onChainFTMetadata && activeTokenFrom.onChainFTMetadata.symbol;
    const validTokensSwapTo = findTokenSwapToList({ tokenSymbol: currentToken, fungibleTokensList });

    useEffect(() => {
        const hasValidParams = validTokensSwapTo && activeTokenFrom;
        const optForPriorityToken = !reversePositionsJustClicked;
        if (hasValidParams && optForPriorityToken) {
            const prioritySwapToTokenSymbol = VALID_TOKEN_PAIRS[activeTokenFrom.onChainFTMetadata.symbol][0];
            const prioritySwapToToken = validTokensSwapTo.find((token) => {
                return token.onChainFTMetadata.symbol == prioritySwapToTokenSymbol;
            });
            setActiveTokenTo(prioritySwapToToken);
        }
    }, [activeTokenFrom]);
    
    const handleSwapToken = async (
        accountId,
        wrapAmount,
        toWNear
    ) => {
        // await Mixpanel.withTracking(
        //     'SWAP token',
        //     async () => {
        //         setSwappingToken(true);

        //         const result =
        //             await fungibleTokensService.wrapNear({
        //                 accountId,
        //                 wrapAmount:
        //                     parseNearAmount(wrapAmount),
        //                 toWNear,
        //             });
        //         setTransactionHash(result.transaction.hash);
        //         setActiveView(VIEWS.SUCCESS);

        //         const id = Mixpanel.get_distinct_id();
        //         Mixpanel.identify(id);
        //         Mixpanel.people.set({
        //             last_send_token: new Date().toString(),
        //         });
        //     },
        //     (e) => {
        //         dispatch(
        //             showCustomAlert({
        //                 success: false,
        //                 messageCodeHeader: 'error',
        //                 messageCode:
        //                     'walletErrorCodes.sendFungibleToken.error',
        //                 errorMessage: e.message,
        //             })
        //         );
        //         setSwappingToken('failed');
        //         return;
        //     }
        // );

        // dispatch(checkAndHideLedgerModal());
        console.log('handleSwapToken', [accountId, wrapAmount, toWNear]);
    };

    // USN based logic
    const [slippageValue, setSlippageValue] = useState(1);
    const slippageError = slippageValue < 1 || slippageValue > 50;

    const { commissionFee, isLoadingCommission } = commission({
        accountId,
        amount: amountTokenFrom,
        delay: 500,
        exchangeRate: + multiplier,
        token: activeTokenFrom,
        activeView,
    });
    const balance = getBalance(activeTokenFrom);

    const { performBuyOrSellUSN, isLoading, setIsLoading } = usePerformBuyOrSellUSN();

    // end USN based logic
    

    const getCurrentViewComponent = (view) => {
        switch (view) {
            case VIEWS.SWAP_AMOUNT:
                return (
                    <SwapAmountForm
                        history={history}
                        setActiveView={setActiveView}
                        amountTokenFrom={amountTokenFrom}
                        setAmountTokenFrom={setAmountTokenFrom}
                        amountTokenTo={amountTokenTo}
                        setAmountTokenTo={setAmountTokenTo}
                        mockRateData={mockRateData}
                        setMockRateData={setMockRateData}
                        activeTokenFrom={activeTokenFrom}
                        setActiveTokenFrom={setActiveTokenFrom}
                        activeTokenTo={activeTokenTo}
                        setActiveTokenTo={setActiveTokenTo}
                        maxFrom={maxFrom}
                        setMaxFrom={setMaxFrom}
                        maxTo={maxTo}
                        setMaxTo={setMaxTo}
                        error={amountError}
                        setReversePositionsJustClicked={setReversePositionsJustClicked}
                    />
                );
            case VIEWS.SELECT_TOKEN_FROM:
                return (
                    <SelectToken
                        onClickGoBack={() => setActiveView(VIEWS.SWAP_AMOUNT)}
                        onSelectToken={(token) => {
                            setActiveTokenFrom(token);
                            setAmountTokenFrom(0);
                            setAmountTokenTo(0);
                            setActiveView(VIEWS.SWAP_AMOUNT);
                            setReversePositionsJustClicked(false);
                        }}
                        fungibleTokens={validTokensSwapFrom}
                        isMobile={isMobile()}
                    />
                );
            case VIEWS.SELECT_TOKEN_TO:
                return (
                    <SelectToken
                        onClickGoBack={() => setActiveView(VIEWS.SWAP_AMOUNT)}
                        onSelectToken={(token) => {
                            setActiveTokenTo(token);
                            setAmountTokenFrom(0);
                            setAmountTokenTo(0);
                            setActiveView(VIEWS.SWAP_AMOUNT);
                        }}
                        fungibleTokens={validTokensSwapTo}
                        isMobile={isMobile()}
                    />
                );
            case VIEWS.REVIEW:
                return (
                    <SwapReviewForm
                        setActiveView={setActiveView}
                        amountTokenFrom={amountTokenFrom}
                        amountTokenTo={amountTokenTo}
                        activeTokenFrom={activeTokenFrom}
                        activeTokenTo={activeTokenTo}
                        mockRateData={mockRateData}
                        accountId={accountId}
                        handleSwapToken={handleSwapToken}
                        swappingToken={swappingToken}
                        slippageError={slippageError}
                        slippageValue={slippageValue}
                        setSlippageValue={setSlippageValue}
                        exchangeRate={+multiplier / 10000}
                        tradingFee={commissionFee?.result}
                        isCommissionLoading={isLoadingCommission}
                        percent={commissionFee?.percent}
                    />
                );

            case VIEWS.SUCCESS:
                return (
                    <Success
                        amount={`${amountTokenFrom} ${activeTokenFrom.onChainFTMetadata?.symbol}`}
                        tokenTo={activeTokenTo.onChainFTMetadata?.symbol}
                        onClickContinue={() => history.push('/')}
                        onClickGoToExplorer={() =>
                            window.open(
                                `${EXPLORER_URL}/transactions/${transactionHash}`,
                                '_blank'
                            )
                        }
                    />
                );
            default:
                return null;
        }
    };

    return (
        <StyledContainer className="small-centered">
            {getCurrentViewComponent(activeView)}
        </StyledContainer>
    );
}

export default Swap;
