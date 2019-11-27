import React from 'react'
import styled from 'styled-components'
import { List } from 'semantic-ui-react';

const CustomDiv = styled(List)`
    position: relative;
    display: inline;
    border-bottom: 1px dotted black;
`
// denomination of one near in minimal non divisible units (attoNears)
// NEAR_NOMINATION is 10 ** 24 one unit
export const NOMINATION = 24
const REG = /(?=(\B)(\d{3})+$)/g;

const Balance = ({ amount }) => {
    if (!amount) {
        throw new Error("amount property should not be null")
    }
    let amountShow = convertToShow(amount)
    return (
        <CustomDiv>
            {amountShow} Ⓝ
        </CustomDiv>
    )
}

const convertToShow = (amount) => {
    return  formatNEAR(amount)

}

export const formatNEAR = (amount) => {
    if (amount.length < NOMINATION - 5) {
        return "<0.00001"
    }
    else if (amount.length <= NOMINATION) {
        let zeros = "0".repeat(NOMINATION)
        return "0." + (zeros.substring(amount.length) + amount).slice(0, 5)
    } else {
        let len = amount.length - NOMINATION
        let numInt = len > 3 ? amount.slice(0, len).replace(REG, ",") : amount.slice(0, len)
        let numDec = amount.slice(len, amount.length)
        return numInt + "." + numDec.slice(0, 5)
    }
}

export default Balance