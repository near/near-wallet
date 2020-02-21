import React from 'react'
import styled from 'styled-components'
import { List } from 'semantic-ui-react'
import { utils } from 'nearlib'
import { BN } from 'bn.js'

const CustomDiv = styled(List)`
    position: relative;
    display: inline;
`

const FRAC_DIGITS = 5
const YOCTO_NEAR_THRESHOLD = new BN('10', 10).pow(new BN(utils.format.NEAR_NOMINATION_EXP - FRAC_DIGITS + 1, 10))

const Balance = ({ amount }) => {
    if (!amount) {
        throw new Error('amount property should not be null')
    }
    let amountShow = formatNEAR(amount)

    return (
        <CustomDiv title={showInYocto(amount)}>
            {amountShow} Ⓝ
        </CustomDiv>
    )
}

export const formatNEAR = (amount) => {
    let ret =  utils.format.formatNearAmount(amount, FRAC_DIGITS)
    if (ret === '0') {
        return `<${
            !FRAC_DIGITS 
                ? `0` 
                : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`
        }`
    }
    return ret
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
