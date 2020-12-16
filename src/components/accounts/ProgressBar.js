import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'

const Container = styled.div`
    margin-bottom: -20px;

    .step-line {
        height: 4px;
        background-color: #37DBF4;
        position: fixed;
        top: 109px;
        left: 0;
        right: 0;
        z-index: 1;
    }
`

export default function ProgressBar({ step }) {
    const total = 4
    return (
    <Container>
        <div className='step-line' style={{ width: `${step / total * 100}%`}}/>
        <Translate id='createAccount.step' data={{ step: step, total: total }}/>
    </Container>
    )
}