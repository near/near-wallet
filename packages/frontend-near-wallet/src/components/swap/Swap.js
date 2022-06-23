import flattenDeep from 'lodash.flattendeep';
import uniq from 'lodash.uniq';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { CREATE_USN_CONTRACT } from '../../../../../features';
import { EXPLORER_URL, NEAR_TOKEN_ID, USN_CONTRACT } from '../../config';
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
import { exchangeRateTranslation, useInterval, commission } from './components/helpers';
import Success from './components/Success';
import { SwapAmountForm } from './components/SwapAmountForm';
import { SwapReviewForm } from './components/SwapReviewForm';

const { fetchToken } = tokensActions;
const { checkAndHideLedgerModal } = ledgerActions;

export const VIEWS = {
    SWAP_AMOUNT: 'swapAmount',
    SELECT_TOKEN_TO: 'selectTokenTo',
    SELECT_TOKEN_FROM: 'selectTokenFrom',
    REVIEW: 'review',
    SUCCESS: 'success',
};

export const VALID_TOKEN_PAIRS = {
    NEAR: [NEAR_TOKEN_ID, USN_CONTRACT],
    [USN_CONTRACT]: ['NEAR'],
    [NEAR_TOKEN_ID]: ['NEAR']
};

const allTokens = uniq(flattenDeep(Object.entries(VALID_TOKEN_PAIRS)));

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
    const fungibleTokensList = useFungibleTokensIncludingNEAR({showTokensWithZeroBalance: true, includeNearContractName: true});
    const accountId = useSelector(selectAccountId);
    const multiplier = useSelector(selectMetadataSlice);
    const [amountTokenFrom, setAmountTokenFrom] = useState(0);
    const [amountTokenTo, setAmountTokenTo] = useState(0);
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

    useInterval(() => {
        // fetchMultiplier every 30 seconds
        dispatch(fetchMultiplier());
    }, 30000);

    const tokensLoader =
        useSelector((state) => selectTokensLoading(state, { accountId })) ||
        false;
    useEffect(() => {
        if (!accountId) {
            return;
        }
        Promise.all(allTokens.map((token) => dispatch(fetchToken({accountId, contractName: token}))));
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

    const validTokensSwapFrom = fungibleTokensList.filter(({ contractName, balance }) => contractName in VALID_TOKEN_PAIRS && !!Number(balance));
    const currentToken = activeTokenFrom && activeTokenFrom.contractName;
    const validTokensSwapTo = fungibleTokensList.filter((token) => (VALID_TOKEN_PAIRS[currentToken] || []).some((contractName) => contractName === token.contractName));

    useEffect(() => {
        const hasValidParams = validTokensSwapTo && activeTokenFrom;
        const optForPriorityToken = !reversePositionsJustClicked;
        if (hasValidParams && optForPriorityToken) {
            const prioritySwapToTokenContract = VALID_TOKEN_PAIRS[activeTokenFrom.contractName][0];
            const prioritySwapToToken = validTokensSwapTo.find((token) => {
                return token.contractName == prioritySwapToTokenContract;
            });
            setActiveTokenTo(prioritySwapToToken);
        }
    }, [activeTokenFrom]);

    const [slippage, setSlippage] = useState(1);
    const commissionFee = commission({
        accountId,
        amount: amountTokenFrom,
        delay: 500,
        exchangeRate: + multiplier,
        token: activeTokenFrom,
        activeView,
    });

    const { performBuyOrSellUSN } = usePerformBuyOrSellUSN();

    const handleSwapToken = async ({
        accountId,
        amount,
        tokenFrom,
        tokenTo
    }) => {
        await Mixpanel.withTracking(
            'SWAP token',
            async () => {
                setSwappingToken(true);
                if (tokenFrom == 'wNEAR' || tokenTo == 'wNEAR') {
                    const result =
                        await fungibleTokensService.wrapNear({
                            accountId,
                            wrapAmount:
                                parseNearAmount(amount),
                            toWNear: tokenTo == 'wNEAR',
                        });
                    setTransactionHash(result.transaction.hash);
                }

                else if ((tokenFrom == 'USN' || tokenTo == 'USN') && CREATE_USN_CONTRACT) {
                    if (amount == maxFrom.numToShow) {
                        // in the event that a user clicks "Max: x" the input box only shows an estimated number
                        // so we must ensure that the actual amount that gets converted is the full max number
                        amount = maxFrom.fullNum;
                    }
                    await performBuyOrSellUSN({
                        accountId, 
                        multiplier, 
                        slippage, 
                        amount, 
                        tokenFrom
                    });
                }
                
                setActiveView(VIEWS.SUCCESS);

                const id = Mixpanel.get_distinct_id();
                Mixpanel.identify(id);
                Mixpanel.people.set({
                    last_send_token: new Date().toString(),
                });
            },
            (e) => {
                dispatch(
                    showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode:
                            'walletErrorCodes.sendFungibleToken.error',
                        errorMessage: e.message,
                    })
                );
                setSwappingToken('failed');
                return;
            }
        );

        dispatch(checkAndHideLedgerModal());
    };

    const getCurrentViewComponent = (view) => {
        switch (view) {
            case VIEWS.SWAP_AMOUNT:
                return (
                    <SwapAmountForm
                        history={history}
                        onClickFromToken={() => CREATE_USN_CONTRACT && setActiveView(VIEWS.SELECT_TOKEN_FROM)}
                        onClickToToken={() => CREATE_USN_CONTRACT && setActiveView(VIEWS.SELECT_TOKEN_TO)}
                        onClickReview={() => setActiveView(VIEWS.REVIEW)}
                        amountTokenFrom={amountTokenFrom}
                        setAmountTokenFrom={setAmountTokenFrom}
                        amountTokenTo={amountTokenTo}
                        setAmountTokenTo={setAmountTokenTo}
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
                        onClickGoBack={() => setActiveView(VIEWS.SWAP_AMOUNT)}
                        amountTokenFrom={amountTokenFrom}
                        amountTokenTo={amountTokenTo}
                        activeTokenFrom={activeTokenFrom}
                        activeTokenTo={activeTokenTo}
                        accountId={accountId}
                        handleSwapToken={handleSwapToken}
                        swappingToken={swappingToken}
                        setSlippage={setSlippage}
                        exchangeRate={formatMultiplier}
                        tradingFee={commissionFee?.result}
                    />
                );

            case VIEWS.SUCCESS:
                return (
                    <Success
                        amountFrom={`${amountTokenFrom} ${activeTokenFrom.onChainFTMetadata?.symbol}`}
                        amountTo={`${amountTokenTo} ${activeTokenTo.onChainFTMetadata?.symbol}`}
                        transactionHash={transactionHash}
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
