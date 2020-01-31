import React from 'react'
import styled from 'styled-components'
import { List } from 'semantic-ui-react';
import { utils } from 'nearlib';

const CustomDiv = styled(List)`
    position: relative;
    display: inline;
`

const FRAC_DIGITS = 5

const Balance = ({ amount }) => {
    if (!amount) {
        throw new Error("amount property should not be null")
    }
    let amountShow = formatNEAR(amount)

    return (
        <CustomDiv title={['0','0.0001'].includes(utils.format.formatNearAmount(amount, (FRAC_DIGITS || 1) - 1)) ? `${formatWithCommas(amount)} yoctoⓃ` : ``}>
            {amountShow} Ⓝ
        </CustomDiv>
    )
}

export const formatNEAR = (amount) => {
    let ret =  utils.format.formatNearAmount(amount, FRAC_DIGITS);
    if (ret === '0') {
        return `<${!FRAC_DIGITS ? `0` : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`}`
    }
    return ret;
}

const formatWithCommas = (value) => {
    const pattern = /(-?\d+)(\d{3})/
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2')
    }
    return value
}

export default Balance