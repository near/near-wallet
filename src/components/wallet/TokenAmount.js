import React from 'react'
import Big from 'big.js'
import { formatTokenAmount } from '../../utils/amounts'

const FRAC_DIGITS = 5

const TokenAmount = ({ token: { balance, decimals, symbol}, className }) => (
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

export default TokenAmount
