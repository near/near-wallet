import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';

import SafeTranslate from '../../../components/SafeTranslate';
// @todo common component: move to .../common
import Token from '../../../components/send/components/entry_types/Token';
import ChevronIcon from '../../../components/svg/ChevronIcon';
import {
    isValidAmount,
    toSignificantDecimals,
    formatTokenAmount,
    removeTrailingZeros,
} from '../../../utils/amounts';
import { DECIMALS_TO_SAFE } from '../utils/constants';

const InputWrapper = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    border: 1px solid #eceef0;
    background-color: #fbfcfd;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0.7rem 0.8rem 0;
`;

const Label = styled.span`
    font-size: 0.9rem;
`;

const Balance = styled.div`
    cursor: pointer;
    font-style: italic;
    border: none;
    background-color: transparent;
    color: #787f85;

    &:not(.disabled) {
        color: #2f98f3;
    }

    &.disabled {
        cursor: default;
    }

    :hover:not(.disabled) {
        text-decoration: underline;
    }
`;

const Footer = styled.div`
    display: grid;
    grid-template-columns: 184px 1fr;
    column-gap: 16px;
    margin-top: 16px;

    @media screen and (max-width: 767px) {
        grid-template-columns: 1fr 1fr;
    }

    input {
        text-align: right;
        padding: 0 15px 0 15px;
        height: 64px;
        margin-top: 0;
        background-color: #f1f3f5;

        :focus {
            background-color: #ffffff;
        }

        input:not(:placeholder-shown) {
            // fix opacity effect on iOS
            -webkit-text-fill-color: #24272A;
            opacity: 1;
        }
    }

    input.error {
        border-color: #fc5b5b;
        color: #fc5b5b;
    }

    .token {
        flex: 1;
    }
`;

const TokenWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #f1f3f5;
    border-radius: 8px;
    transition: 100ms;
    height: 64px;
    cursor: pointer;

    > div {
        width: 100%;
        padding: 0px;
        color: #272729;
        font-weight: 600;
    }

    .icon {
        margin-right: 15px;
    }
`;

export default memo(function Input({
    value = '',
    loading = false,
    onChange,
    onSelectToken,
    labelId,
    maxBalance = 0,
    tokenSymbol,
    tokenIcon,
    tokenDecimals,
    setIsValidInput,
    inputTestId,
    tokenSelectTestId,
    disabled,
    autoFocus,
}) {
    const handleChange = (event) => {
        event.preventDefault();

        const value = event.target.value.replace(',', '.');

        if (!disabled && isValidAmount(value)) {
            onChange(value);
        }
    };

    const formattedMaxBalance =
        maxBalance && typeof tokenDecimals === 'number'
            ? removeTrailingZeros(formatTokenAmount(maxBalance, tokenDecimals, tokenDecimals))
            : undefined;

    const [isWrongAmount, setIsWrongAmount] = useState(false);

    useEffect(() => {
        if (!disabled && value && formattedMaxBalance) {
            const isValid = isValidAmount(value, formattedMaxBalance, tokenDecimals);

            setIsWrongAmount(!isValid);

            if (setIsValidInput) {
                setIsValidInput(isValid);
            }
        }
    }, [disabled, value, formattedMaxBalance, tokenDecimals]);

    const setMaxBalance = () => {
        if (!disabled && formattedMaxBalance && value !== formattedMaxBalance) {
            onChange(formattedMaxBalance);
        }
    };

    const balanceData = {
        amount: toSignificantDecimals(formattedMaxBalance),
        symbol: tokenSymbol,
    };

    const valueToShow =
        disabled && value
            ? toSignificantDecimals(value, DECIMALS_TO_SAFE)
            : value;

    return (
        <InputWrapper>
            <Header>
                {labelId && (
                    <Label>
                        <SafeTranslate id={labelId} />
                    </Label>
                )}
                {formattedMaxBalance && (
                    <Balance onClick={setMaxBalance} className={`${disabled ? 'disabled' : ''}`}>
                        <SafeTranslate
                            id={disabled ? 'swap.available' : 'swap.max'}
                            data={balanceData}
                        />
                    </Balance>
                )}
            </Header>
            <Footer>
                <TokenWrapper
                    className="token"
                    onClick={onSelectToken}
                    data-test-id={tokenSelectTestId}
                >
                    <Token symbol={tokenSymbol} icon={tokenIcon} />
                    <ChevronIcon color="var(--mnw-color-1)" />
                </TokenWrapper>
                <input
                    className={`${isWrongAmount ? 'error' : ''}`}
                    inputMode="decimal"
                    min={0}
                    max={Number(maxBalance) || 0}
                    value={loading ? '' : valueToShow}
                    onChange={handleChange}
                    placeholder="0"
                    autoFocus={autoFocus}
                    disabled={disabled}
                    data-test-id={inputTestId}
                />
            </Footer>
        </InputWrapper>
    );
});
