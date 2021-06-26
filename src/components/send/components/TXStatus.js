import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
`
const Indicator = styled.span`
    display: inline-block;
    width: 9px;
    height: 9px;   
    background-color: ${props => props.color};
    border-radius: 50%;
    margin-right: 10px;
`

const TXStatus = ({ status }) => {

    const getStatusColor = () => {
        switch (status) {
            case 'SuccessValue':
                return '#4DD5A6'
            case 'Failure':
                return '#ff585d'
            case 'notAvailable':
                return '#ff585d'
            default:
                return
        }
    }

    return (
        <StyledContainer className='status'>
            <Indicator color={getStatusColor()}/>
            <Translate id={`sendV2.TXEntry.status.${status}`} />
        </StyledContainer>
    )
}

export default TXStatus