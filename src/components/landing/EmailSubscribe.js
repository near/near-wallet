import React, { useState } from 'react'
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

    @media (max-width: 767px) {
        padding: 100px 20px 50px 20px;
    }

    @media (max-width: 660px) {
        border-radius: 0;
    }

    form {
        display: flex;
        background-color: white;
        border-radius: 40px;
        padding: 5px;
        margin-top: 20px;

        @media (max-width: 767px) {
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
        padding: 10px 30px;
        transition: 100ms;
        word-break: keep-all;

        &:hover {
            background-color: #ff6d71;
        }
    }
`

export default function EmailSubscribe() {
    const [email, setEmail] = useState('');

    return (
        <Container className='email-subscribe'>
            <Translate id='emailSubscribe.title' />
            <form action={`https://nearprotocol.us14.list-manage.com/subscribe/post?u=faedf5dec8739fb92e05b4131&amp;id=4470dc6b88&MERGE0=${email}`} method="post" target="_blank" noValidate>
                <Translate>
                    {({ translate }) => (
                        <input placeholder={translate('emailSubscribe.placeholder')} value={email} onChange={e => setEmail(e.target.value)}/>
                    )}
                </Translate>
                <button type='submit'><Translate id='button.subscribe' /></button>
            </form>
        </Container>
    )
}