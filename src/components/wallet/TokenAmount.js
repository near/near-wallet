import React from 'react'
import Big from 'big.js'
import { formatTokenAmount } from '../../utils/amounts'


const TokenAmount = ({ token: { balance, decimals, symbol}, className }) => (
    <div className={className}>
        {balance}
    </div>
)

export default TokenAmount
