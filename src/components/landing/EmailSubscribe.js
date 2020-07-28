import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'

const Container = styled.div`
    background-color: #25272A;
    border-radius: 6px;
    max-width: 660px;
    margin: 0 auto;
    padding: 50px 40px;
    font-weight: 500;
    color: white;

    @media (max-width: 768px) {
        margin: -215px -5px 50px -5px;
        border-radius: 0;
        padding: 100px 20px 50px 20px;
    }

    span {
        span {
            color: #FAE058;
        }
    }

    form {
        display: flex;
        background-color: white;
        border-radius: 40px;
        padding: 5px;
        margin-top: 20px;

        @media (max-width: 768px) {
            flex-direction: column;
            background-color: transparent;

            input {
                height: 40px !important;
            }

            button {
                margin-top: 20px;
                height: 40px;
            }
        }
    }

    input {
        border-radius: 40px !important;
        background-color: white !important;
        border: 0 !important;
        height: auto !important;
        margin: 0 !important;
    }

    button {
        border-radius: 40px;
        background-color: #ff585d;
        color: white;
        border: none;
        font-weight: 500 !important;
        padding: 4px 30px;
    }
`

export default function EmailSubscribe() {
    return (
        <Container className='email-subscribe'>
            <Translate id='emailSubscribe.title' />
            <form onSubmit={() => {}}>
                <Translate>
                    {({ translate }) => (
                        <input placeholder={translate('emailSubscribe.placeholder')}/>
                    )}
                </Translate>
                <button type='submit'><Translate id='button.subscribe' /></button>
            </form>
        </Container>
    )
}