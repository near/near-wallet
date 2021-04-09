import React from 'react'
import { formatTokenAmount } from '../../utils/amounts'

const FRAC_DIGITS = 5

const TokenAmount = ({ token: { balance, decimals, symbol}, className }) => (
    <div className={className} title={showFullAmount(balance, decimals, symbol)}>
        {balance && formatToken(balance, decimals)}
    </div>
)

const formatToken = (amount, decimals) => {
    if (amount === '0') {
        return amount
    }

    let formattedAmount = formatTokenAmount(amount, decimals, FRAC_DIGITS)

    if (formattedAmount === `0.${'0'.repeat(FRAC_DIGITS)}`) {
        return `<${!FRAC_DIGITS ? `0` : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`}`
    }
    return formattedAmount
}

const showFullAmount = (amount, decimals, symbol) => 
    (amount !== '0' && !!amount)
        ? `${formatTokenAmount(amount, decimals, decimals)} ${symbol}` 
        : ''

export default TokenAmount
