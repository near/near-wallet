import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import { Translate } from 'react-localize-redux'

const StyledContainer = styled(Container)`

`

export function BuyNear({ match, location }) {
    const dispatch = useDispatch();
    const { accountId, balance } = useSelector(({ account }) => account);

    return (
        <StyledContainer>
            Buy NEAR
        </StyledContainer>
    )
}