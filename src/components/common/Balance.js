import React from 'react'
import styled from 'styled-components'
import { List } from 'semantic-ui-react'
import { utils } from 'near-api-js'
import { BN } from 'bn.js'

const CustomDiv = styled(List)`
    position: relative;
    white-space: nowrap;
    display: inline-flex !important;
    align-items: center;
    margin: 0 !important;
    line-height: normal;

    .symbol {
        transform: scale(0.65);
        font-weight: 700;
        margin-left: -2%;
    }
    .dots {
        color: #4a4f54;
        margin: 0 12px 0 0;

        :after {
            content: '.';
            animation: link 1s steps(5, end) infinite;
        
            @keyframes link {
                0%, 20% {
                    color: rgba(0,0,0,0);
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                40% {
                    color: #4a4f54;
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                60% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 rgba(0,0,0,0);
                }
                80%, 100% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 #4a4f54;
                }
            }
        }
    }
`

const FRAC_DIGITS = 5
const YOCTO_NEAR_THRESHOLD = new BN('10', 10).pow(new BN(utils.format.NEAR_NOMINATION_EXP - FRAC_DIGITS + 1, 10))

const Balance = ({ amount, symbol, className }) => {
    let amountShow = amount && formatNEAR(amount)

    return (
        <CustomDiv title={showInYocto(amount)} className={className}>
            {symbol !== false && symbol !== 'near' && <span className='symbol'>Ⓝ</span>}
            {amount
                ? amountShow
                : <div className="dots"></div>
            }
            {symbol === 'near' && <span className='currency'>&nbsp;NEAR</span>}
        </CustomDiv>
    )
}

export const formatNEAR = (amount) => {
    amount = amount.toString();
    if (amount === '0') {
        return amount;
    }
    let formattedAmount = utils.format.formatNearAmount(amount, FRAC_DIGITS);
    if (formattedAmount === '0') {
        return `<${!FRAC_DIGITS ? `0` : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`}`;
    }
    return formattedAmount;
}

const showInYocto = (amountStr) => {
    const amount = new BN(amountStr)
    if (amount.lte(YOCTO_NEAR_THRESHOLD)) {
        return formatWithCommas(amountStr) + ' yoctoⓃ'
    }
}

const formatWithCommas = (value) => {
    const pattern = /(-?\d+)(\d{3})/
    while (pattern.test(value)) {
        value = value.toString().replace(pattern, '$1,$2')
    }
    return value
}

export default Balance
