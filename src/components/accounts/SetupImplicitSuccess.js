import React from 'react'
import { useSelector } from 'react-redux'
import Container from '../common/styled/Container.css'
import FormButton from '../common/FormButton'
import { Translate } from 'react-localize-redux'

export function SetupImplicitSuccess() {

    const account = useSelector(({ account }) => account);

    return (
        <Container className='small-centered ledger-theme'>
            <h1><Translate id='signInLedger.header'/></h1>
            {account.accountId}
        </Container>
    );
}