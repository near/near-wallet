import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

import { EXPLORER_URL } from '../../config';
import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { Mixpanel } from '../../mixpanel/index';
import { showCustomAlert } from '../../redux/actions/status';
import { selectAccountId } from '../../redux/slices/account';
import { actions as ledgerActions } from '../../redux/slices/ledger';
import {
    actions as tokensActions,
    selectTokensLoading,
} from '../../redux/slices/tokens';
import { fungibleTokensService } from '../../services/FungibleTokens';
import Container from '../common/styled/Container.css';
import { validateInput } from '../../utils/wrap-unwrap';
import Success from './components/Success';
import { SwapAmountForm } from './components/SwapAmountForm';
import { SwapReviewForm } from './components/SwapReviewForm';

const { fetchTokens } = tokensActions;
const { checkAndHideLedgerModal } = ledgerActions;

export const VIEWS = {
    SWAP_AMOUNT: 'swapAmount',
    SELECT_TOKEN: 'selectToken',
    REVIEW: 'review',
    SUCCESS: 'success',
};

const W_NEAR_PROPS = {
    balance: '0',
    onChainFTMetadata: {
        spec: 'ft-1.0.0',
        name: 'Wrapped NEAR fungible token',
        symbol: 'wNEAR',
        icon: null,
        reference: null,
    },
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

export function SwapNear({ match, location, history }) {
    let fungibleTokensList = useFungibleTokensIncludingNEAR();
    const accountId = useSelector(selectAccountId);
    const [amountTokenFrom, setAmountTokenFrom] = useState(0);
    const [amountTokenTo, setAmountTokenTo] = useState(0);
    const [mockRateData, setMockRateData] = useState(1);
    const [maxFrom, setMaxFrom] = useState({ fullNum: '0', numToShow: '0' });
    const [maxTo, setMaxTo] = useState({ fullNum: '0', numToShow: '0' });
    const [error, setError] = useState(false);
    const [activeView, setActiveView] = useState(VIEWS.SWAP_AMOUNT);
    const [activeTokenFrom, setActiveTokenFrom] = useState();
    const [activeTokenTo, setActiveTokenTo] = useState();
    const [swappingToken, setSwappingToken] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const dispatch = useDispatch();
    const tokensLoader =
        useSelector((state) => selectTokensLoading(state, { accountId })) ||
        false;
    useEffect(() => {
        if (!accountId) {
            return;
        }
        dispatch(fetchTokens({ accountId }));
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

    useEffect(() => {
        setAmountTokenFrom(amountTokenTo);
    }, [amountTokenTo]);

    useEffect(() => {
        setAmountTokenTo(amountTokenFrom);
        setError(!validateInput(amountTokenFrom, maxFrom.fullNum));
    }, [amountTokenFrom, maxFrom]);


    const handleSwapToken = async (
        accountId,
        wrapAmount,
        toWNear
    ) => {
        await Mixpanel.withTracking(
            'SWAP token',
            async () => {
                setSwappingToken(true);

                const result =
                    await fungibleTokensService.wrapNear({
                        accountId,
                        wrapAmount:
                            parseNearAmount(wrapAmount),
                        toWNear,
                    });
                setTransactionHash(result.transaction.hash);
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
    }

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
                        error={error}
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
