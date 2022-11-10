import React, { FC } from 'react';

import {
    formatTokenAmount,
    removeTrailingZeros,
    integerPartWithCommaSeparators,
} from '../../../utils/amounts';
import FiatBalance from '../balance/FiatBalance';

const DECIMALS_TO_SAFE = 5;

const formatAmount = (amount: string, decimals: number): string => {
    if (amount === '0') {
        return amount;
    }

    const formattedAmount = formatTokenAmount(amount, decimals, DECIMALS_TO_SAFE);

    if (formattedAmount === `0.${'0'.repeat(DECIMALS_TO_SAFE)}`) {
        return `< ${!DECIMALS_TO_SAFE ? '0' : `0.${'0'.repeat(DECIMALS_TO_SAFE - 1)}1`}`;
    }

    return integerPartWithCommaSeparators(removeTrailingZeros(formattedAmount));
};

const showFullAmount = (amount: string, decimals: number, symbol: string): string => {
    return amount !== '0' && !!amount
        ? `${formatTokenAmount(amount, decimals, decimals)} ${symbol}`
        : '';
};

type TokenAmountProps = {
    token: Wallet.Token;
    withSymbol?: boolean;
    className: string;
    showFiatAmount?: boolean;
    'data-test-id': string;
    balancePrefix?: string;
};

const TokenAmount: FC<TokenAmountProps> = ({
    token,
    withSymbol = false,
    className,
    showFiatAmount = true,
    'data-test-id': testId,
    balancePrefix = '',
}) => {
    const { balance, onChainFTMetadata, fiatValueMetadata } = token;
    const title = showFullAmount(
        balance,
        onChainFTMetadata?.decimals,
        onChainFTMetadata?.symbol
    );

    return (
        <div className={className} title={title} data-test-id={testId}>
            <div>
                {balance ? (
                    balancePrefix + formatAmount(balance, onChainFTMetadata?.decimals)
                ) : (
                    <span className="dots" />
                )}
                <span className="currency">
                    {withSymbol ? ` ${onChainFTMetadata?.symbol}` : null}
                </span>
            </div>

            {showFiatAmount ? (
                <div className="fiat-amount">
                    <FiatBalance
                        amount={balance}
                        nearTokenFiatValueUSD={fiatValueMetadata?.usd}
                        decimals={onChainFTMetadata?.decimals}
                        isNear
                    />
                </div>
            ) : null}
        </div>
    );
};

export default TokenAmount;
