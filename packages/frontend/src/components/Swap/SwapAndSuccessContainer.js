import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { refreshAccount } from '../../redux/actions/account';
import { handleSwapBycontractName, selectSwapBycontractName } from '../../redux/slices/swap';
import { actions as tokensActions } from '../../redux/slices/tokens';
import Container from '../common/styled/Container.css';
import { currentToken } from './helpers';
import Success from './views/Success';
import SwapPage from './views/SwapPage';

const { fetchTokens } = tokensActions;


export const VIEWS_SWAP = {
    MAIN: 'main',
    SUCCESS: 'success'
};

const StyledContainer = styled(Container)`
    position: relative;

    h1 {
        text-align: center;
        margin-bottom: 30px;
    }

    .text {
        margin-bottom: 11px;
    }

    .iconSwap {
        margin: 0 auto;
        width: fit-content;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px 8px 5px 5px;
        border-radius: 50%;
        border: 1px solid #3170c7;

        :hover {
            svg {
                g, path {
                    stroke: #0072ce;
                    fill: #0072ce;
                }
            }
        }

        svg {
            transform: rotate(90deg);
            cursor: pointer;

            g:hover {
                stroke: #0072ce;
                fill: #0072ce;
            }
        }
    }

    .buttons-bottom-buttons {
        margin-top: 30px;

        > button {
            display: block;
            width: 100%;
        }

        .link {
            display: block !important;
            margin: 20px auto !important;
        }
    }

    .text_info_success {
        width: fit-content;
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 28px;
        text-align: center;
        color: #252729;
        margin: 0 auto;
    }
`;


const SwapAndSuccessContainer = ({
    fungibleTokensList,
    accountId,
    multiplier,
}) => {
    const [from, setFrom] = useState(fungibleTokensList[0]);
    const [to, setTo] = useState(currentToken(fungibleTokensList, 'USN'));
    const [inputValueFrom, setInputValueFrom] = useState(0);
    const swapContractValue = useSelector(selectSwapBycontractName);
    const [activeView, setActiveView] = useState(VIEWS_SWAP.MAIN);
    const dispatch = useDispatch();

    useEffect(() => {
        if (swapContractValue && swapContractValue === 'NEAR') {
            setFrom(currentToken(fungibleTokensList, 'USN'));
            setTo(fungibleTokensList[0]);
            return;
        }

        setFrom(currentToken(fungibleTokensList, from?.onChainFTMetadata?.symbol));
        setTo(currentToken(fungibleTokensList, to?.onChainFTMetadata?.symbol || 'USN'));

    }, [fungibleTokensList]);


    useEffect(() => {
        return () => dispatch(handleSwapBycontractName(''));
    }, [dispatch]);

    const onHandleSBackToSwap = useCallback(async () => {
        await dispatch(refreshAccount());
        await dispatch(fetchTokens({ accountId }));
        setActiveView('main');
    }, []);

    const getCurrentViewComponent = (activeView) => {
        switch (activeView) {
            case VIEWS_SWAP.MAIN:
                return (
                    <SwapPage
                        setActiveView={setActiveView}
                        accountId={accountId}
                        from={from}
                        inputValueFrom={inputValueFrom}
                        multiplier={multiplier}
                        setInputValueFrom={setInputValueFrom}
                        to={to}
                        onSwap={() => {
                            if (to?.balance === '0' || !to?.balance) return;

                            if (from?.onChainFTMetadata?.symbol === 'NEAR') {
                                setFrom(currentToken(fungibleTokensList, 'USN'));
                                setTo(fungibleTokensList[0]);
                            } else {
                                setFrom(fungibleTokensList[0]);
                                setTo(currentToken(fungibleTokensList, 'USN'));
                            }
                        }}
                    />
                );
            case VIEWS_SWAP.SUCCESS:
                return (
                    <Success
                        inputValueFrom={inputValueFrom}
                        symbol={from.onChainFTMetadata?.symbol}
                        to={to}
                        multiplier={multiplier}
                        handleBackToSwap={async () => {
                            setInputValueFrom(0);
                            await onHandleSBackToSwap();
                        }}
                    />
                );

            default:
                return null;
        }
    };


    return (
        <StyledContainer className='small-centered'>
            {getCurrentViewComponent(activeView)}
        </StyledContainer>
    );
};

export default SwapAndSuccessContainer;
