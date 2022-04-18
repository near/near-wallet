import React, { useRef } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { EXPLORER_URL } from '../../config';
import { formatTokenAmount } from '../../utils/amounts';
import { formatNearAmount } from '../common/balance/helpers';
import TokenIcon from '../send/components/TokenIcon';
import { exchengeRateTranslation } from './helpers';

const SwapContainer = styled.div`
    width: 100%;
    height: 96px;
    background: #ffffff;
    border: 1px solid #3170c7;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 20px;
    &.error {
        border: 1px solid #ec6563;
    }

    input {
        text-align: right;
        padding-right: 3px;
        height: auto;
        border: 0;
        background-color: white;
        width: 150px;
        margin-left: auto;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;
        color: #252729;
    }

    .exchenge {
        text-align: right;
        padding: 0;
        height: auto;
        border: 0;
        background-color: white;
        width: fit-content;
        margin-left: auto;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;
        color: #252729;
    }

    .inputError {
        color: #ec6563;
    }

    .symbolFlex {
        display: flex;
        width: 100%;
        align-items: center;
    }
    .icon {
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        align-self: center;

        img,
        svg {
            height: 32px;
            width: 32px;
        }
    }

    .desc {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 5px;
        display: block;
        min-width: 0;

        .symbol {
            font-weight: 700;
            font-size: 16px;
            color: #24272a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            margin-right: 10px;

            a {
                color: inherit;
            }
        }
    }
`;

const SwapTokenContainer = ({
    text,
    fromTotoken,
    value,
    setInputValueFrom,
    muliplier,
}) => {
    const inputRef = useRef(null);
    const balance =
        fromTotoken?.onChainFTMetadata?.symbol === 'NEAR'
            ? +formatNearAmount(fromTotoken?.balance)
            : +formatTokenAmount(
                  fromTotoken?.balance,
                  fromTotoken?.onChainFTMetadata?.decimals,
                  5
              );

    const error = setInputValueFrom && balance < +value;
    const formatMuliplier = +muliplier / 10000;
    const handelChange = (e) => {
        const { value } = e.target;
        setInputValueFrom(value.replace(/[^.\d,]/g, ''));
    };

    const onFocus = () => {
        if (setInputValueFrom) {
            inputRef.current.focus();
        }
    };

    return (
        <SwapContainer className={error ? 'error' : ''} onClick={onFocus}>
            <div className="text">
                <Translate id={text} />
            </div>
            <div className="symbolFlex">
                <div className="icon">
                    <TokenIcon
                        symbol={fromTotoken?.onChainFTMetadata?.symbol}
                        icon={fromTotoken?.onChainFTMetadata?.icon}
                    />
                </div>
                <div className="desc">
                    {fromTotoken?.contractName ? (
                        <span
                            className="symbol"
                            title={fromTotoken?.contractName}
                        >
                            <a
                                href={`${EXPLORER_URL}/accounts/${fromTotoken?.contractName}`}
                                onClick={(e) => e.stopPropagation()}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {fromTotoken?.onChainFTMetadata?.name ||
                                    fromTotoken?.onChainFTMetadata?.symbol}
                            </a>
                        </span>
                    ) : (
                        <span className="symbol">
                            {fromTotoken?.onChainFTMetadata?.symbol}
                        </span>
                    )}
                </div>
                {setInputValueFrom ? (
                    <input
                        ref={inputRef}
                        type="text"
                        autoFocus
                        value={value}
                        onChange={handelChange}
                        className={error ? 'inputError' : ''}
                    />
                ) : muliplier && fromTotoken ? (
                    <div className="exchenge">
                        ≈
                        <>
                            {exchengeRateTranslation(
                                fromTotoken,
                                +value,
                                formatMuliplier
                            )?.toFixed(5)}
                        </>
                    </div>
                ) : null}
            </div>
        </SwapContainer>
    );
};

export default SwapTokenContainer;
