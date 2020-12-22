import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import AlertRoundedIcon from '../svg/AlertRoundedIcon.js'
import FormButton from './FormButton'
import classNames from '../../utils/classNames'

const Container = styled.div`
    &&& {
        display: flex;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 30px;

        @media (max-width: 450px) {
            margin: -35px -14px 30px -14px;
            border-radius: 0;
        }

        &.alert {
            background-color: #FFF0DE;
            color: #A15600;
        }

        &.light-blue {
            background-color: #F0F9FF;
            color: #0072ce;

            svg {
                path {
                    stroke: #0072ce;
                }
            }

            button, a {
                &.link {
                    color: #12345D !important;
                }
            }
        }

        svg {
            min-width: 21px;
            min-height: 21px;
            margin: 8px 0;
            transform: rotate(180deg);
        }

        div {
            font-style: italic;
            margin-left: 20px;
            font-size: 13px;
        }

        button, a {
            &.link {
                display: block;
                text-transform: initial !important;
                margin: 10px 0 0 0 !important;
                width: auto !important;
                text-decoration: underline !important;
                font-weight: 500 !important;
                font-style: normal !important;
            }
        }

        a {
            display: table !important;
        }
    }
`

export default function AlertBanner({ title, button, linkTo, data, theme }) {
    return (
        <Container className={classNames(['alert-banner', theme])}>
            <AlertRoundedIcon/>
            <div>
                <Translate id={title} data={{ data: data }}/>
                {linkTo.includes('http') ? (
                    <a target='_blank' rel='noreferrer' className='link' href={linkTo}><Translate id={button} /></a>
                ) : (
                    <FormButton className='link' linkTo={linkTo}><Translate id={button} /></FormButton>
                )}
            </div>
        </Container>
    )
}