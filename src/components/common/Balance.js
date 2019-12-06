import React from 'react'
import styled from 'styled-components'
import { List } from 'semantic-ui-react';
import { utils } from 'nearlib';

const CustomDiv = styled(List)`
    position: relative;
    display: inline;
    border-bottom: 1px dotted black;
`

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
    return utils.format.formatNearAmount(amount)
}

export const formatNEAR = (amount) => {
    return utils.format.formatNearAmount(amount)
}

export default Balance