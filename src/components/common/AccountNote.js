import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'

const Container = styled.div`
    font-style: italic;
    padding: 20px 0;

    p {
        margin-bottom: 5px;
    }

    ul {
        margin-top: 0;
        padding-left: 17px;
    }
`

const AccountNote = () => (

    <Container>
        <p><Translate id='createAccount.note.one'/></p>
        <ul>
            <li><Translate id='createAccount.note.two'/></li>
            <li><Translate id='createAccount.note.three'/></li>
            <li><Translate id='createAccount.note.four'/></li>
        </ul>
        <p><Translate id='createAccount.note.five'/></p>
        <ul>
            <li><Translate id='createAccount.note.six'/></li>
        </ul>
    </Container>
)

export default AccountNote