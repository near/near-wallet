import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import AlertTriangleIcon from '../../svg/AlertTriangleIcon.js'
import FormButton from '../../common/FormButton'

const Container = styled.div`
    background-color: #FFF0DE;
    color: #A15600;
    display: flex;
    padding: 20px;
    border-radius: 4px;

    svg {
        min-width: 21px;
        min-height: 21px;
        margin: 8px 0;
    }

    div {
        font-style: italic;
        margin-left: 20px;
        font-size: 13px;
    }

    .link {
        color: #452500 !important;
        text-transform: initial !important;
        margin: 20px 0 0 0 !important;
        width: auto !important;
        font-size: 13px !important;
    }

`

export default function AlertBanner({ title, button, linkTo }) {
    return (
        <Container className='alert-banner'>
            <AlertTriangleIcon/>
            <div>
                <Translate id={title} />
                <FormButton className='link' linkTo={linkTo}><Translate id={button} /></FormButton>
            </div>
        </Container>
    )
}