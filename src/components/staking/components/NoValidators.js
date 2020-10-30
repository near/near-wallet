import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import NearCircleIcon from '../../svg/NearCircleIcon.js'
import FormButton from '../../common/FormButton'

const Container = styled.div`
    background-color: #F8F8F8;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    margin: 20px 0px;
    padding: 20px;

    svg {
        margin-top: 20px;
    }

    div {
        margin-top: 25px;
        max-width: 230px;
        text-align: center;
        color: #B4B4B4;
    }

    button {
        &.blue {
            margin-bottom: 0 !important;
        }
    }
`

export default function NoValidators() {
    return (
        <Container className='no-validators'>
            <NearCircleIcon/>
            <div><Translate id='staking.noValidators.title' /></div>
            <FormButton className='gray-blue dark' linkTo='/staking/validators'><Translate id='staking.staking.button' /></FormButton>
        </Container>
    )
}