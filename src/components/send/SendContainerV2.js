import React from 'react'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import Receipt from './components/Receipt'

const StyledContainer = styled(Container)`
`

export function SendContainerV2() {
    return (
        <StyledContainer className='small-centered'>
            <Receipt/>
        </StyledContainer>
    )
}