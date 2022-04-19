import React from "react";

<<<<<<< HEAD
import { formatTokenAmount, removeTrailingZeros } from "../../utils/amounts";
import BalanceDisplayUSD from "../common/balance/BalanceDisplayUSD";
=======
import { formatTokenAmount, removeTrailingZeros } from '../../utils/amounts';
import BalanceDisplayUSD from '../common/balance/BalanceDisplayUSD';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

const FRAC_DIGITS = 5;

const amountWithCommas = (amount) => {
    var parts = amount.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

const formatToken = (amount, decimals) => {
    if (amount === "0") {
        return amount;
    }

    let formattedAmount = formatTokenAmount(amount, decimals, FRAC_DIGITS);

<<<<<<< HEAD
    if (formattedAmount === `0.${"0".repeat(FRAC_DIGITS)}`) {
        return `< ${
            !FRAC_DIGITS ? "0" : `0.${"0".repeat((FRAC_DIGITS || 1) - 1)}1`
=======
    if (formattedAmount === `0.${'0'.repeat(FRAC_DIGITS)}`) {
        return `< ${
            !FRAC_DIGITS ? '0' : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        }`;
    }
    return amountWithCommas(removeTrailingZeros(formattedAmount));
};

const showFullAmount = (amount, decimals, symbol) =>
<<<<<<< HEAD
    amount !== "0" && !!amount
=======
    amount !== '0' && !!amount
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        ? `${formatTokenAmount(amount, decimals, decimals)} ${symbol}`
        : "";

const TokenAmount = ({
<<<<<<< HEAD
    token: { balance, onChainFTMetadata, coingeckoMetadata },
    withSymbol = false,
    className,
    showFiatAmount = true,
    "data-test-id": testId,
=======
    token: { balance, onChainFTMetadata, fiatValueMetadata },
    withSymbol = false,
    className,
    showFiatAmount = true,
    'data-test-id': testId,
    balancePrefix = ''
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
}) => (
    <div
        className={className}
        title={showFullAmount(
            balance,
            onChainFTMetadata?.decimals,
            onChainFTMetadata?.symbol
        )}
        data-test-id={testId}
    >
        <div>
            {balance ? (
<<<<<<< HEAD
                formatToken(balance, onChainFTMetadata?.decimals)
=======
                balancePrefix + formatToken(balance, onChainFTMetadata?.decimals)
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
            ) : (
                <span className="dots" />
            )}
            <span className="currency">
                {withSymbol ? ` ${onChainFTMetadata?.symbol}` : null}
            </span>
        </div>
<<<<<<< HEAD
        {showFiatAmount && coingeckoMetadata?.usd ? (
            <div className="fiat-amount">
                <BalanceDisplayUSD
                    amount={balance}
                    nearTokenFiatValueUSD={coingeckoMetadata?.usd}
=======
        {showFiatAmount ? (
            <div className="fiat-amount">
                <BalanceDisplayUSD
                    amount={balance}
                    nearTokenFiatValueUSD={fiatValueMetadata?.usd}
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                    decimals={onChainFTMetadata?.decimals}
                    isNear={true}
                />
            </div>
<<<<<<< HEAD
        ) : (
            <div className="fiat-amount">— USD</div>
        )}
=======
        ) : null}
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
    </div>
);

export default TokenAmount;
