import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import AlertTriangleIcon from '../../svg/AlertTriangleIcon.js'
import FormButton from '../../common/FormButton'
import classNames from '../../../utils/classNames'

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
        text-align: left;
        line-break: normal;
    }

    .link {
        color: #452500 !important;
        text-transform: initial !important;
        margin: 20px 0 0 0 !important;
        width: auto !important;
        font-size: 13px !important;
    }

    &.error {
        background-color: #FADFDF;
        color: #921C15;

        svg {
            path {
                stroke: #921C15;
            }
        }
    }

`

export default function AlertBanner({ title, button, linkTo, theme, titleData }) {
    return (
        <Container className={classNames(['alert-banner', theme])}>
            <AlertTriangleIcon/>
            <div>
                <Translate id={title} data={{ data: titleData }}/>
                {linkTo && button && <FormButton className='link' linkTo={linkTo}><Translate id={button} /></FormButton>}
            </div>
        </Container>
    )
}