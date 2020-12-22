import React, { useEffect } from 'react'
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

export default function ProgressBar({ step = '1', total = '4', loader }) {

     useEffect(() => {
        const container = document.getElementById('use-progress-bar')
        if (container) {
            handleAddProgessIndicator()
        }

    }, [loader])

    const handleAddProgessIndicator = () => {
        let element = document.createElement('div')
        element.innerHTML = `Step ${step}/${total}`
        element.style.cssText = 'width: 100%; text-align: left;'
        const container = document.getElementById('use-progress-bar')
        container.prepend(element)
    }

    return (
        <Container className='progress-bar-container'>
            <div className='step-line' style={{ width: `${step / total * 100}%`}}/>
            {/* <Translate id='createAccount.step' data={{ step: step, total: total }}/> */}
        </Container>
    )
}