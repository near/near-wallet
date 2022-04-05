import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from '../common/styled/Container.css';
import { currentToken } from './helpers';
import { useDispatch } from 'react-redux';
import { handleSwapBycontractName } from '../../redux/slices/swap';
import SwapPage from './views/SwapPage';
import Success from './views/Success';

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

        svg {
            transform: rotate(90deg);
            cursor: pointer;
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
    miltiplier,
    swapContractValue,
    activeView,
    isLoading,
    handleSwapToken,
    handleBackToSwap,
    onRefreshMultiplier
}) => {
    const [from, setFrom] = useState(fungibleTokensList[0]);
    const [to, setTo] = useState(currentToken(fungibleTokensList, 'USN'));
    const [inputValueFrom, setInputValueFrom] = useState(0);
    const [slippPageValue, setSlippPageValue] = useState(1);
    const [USNamount, setUSNamount] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        if(swapContractValue && swapContractValue === 'NEAR') {
            setFrom(currentToken(fungibleTokensList, 'USN'));
            setTo(fungibleTokensList[0]);
            return;
        } 

        setFrom(currentToken(fungibleTokensList, from?.onChainFTMetadata?.symbol));
        setTo(currentToken(fungibleTokensList, to?.onChainFTMetadata?.symbol || 'USN'));
        
    }, [fungibleTokensList]);


    useEffect(() => {
        return () => dispatch(handleSwapBycontractName(''))
    },[dispatch])

   const getCurrentViewComponent = (activeView) => {
    switch (activeView) {
    case VIEWS_SWAP.MAIN:
            return (
                <SwapPage
                    onRefreshMultiplier={() => onRefreshMultiplier()}
                    onClickContinue={() =>  handleSwapToken(slippPageValue, +inputValueFrom, from?.onChainFTMetadata?.symbol, USNamount)}
                    accountId={accountId}
                    from={from}
                    inputValueFrom={inputValueFrom}
                    isLoading={isLoading}
                    miltiplier={miltiplier}
                    setInputValueFrom={setInputValueFrom}
                    setSlippPageValue={setSlippPageValue}
                    setUSNamount={setUSNamount}
                    slippPageValue={slippPageValue}
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
                    miltiplier={miltiplier}
                    handleBackToSwap={async () => {
                        setInputValueFrom(0)
                       await handleBackToSwap(); 
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
