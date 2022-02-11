import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import SharedPassphraseList from './SharedPassphraseList';

const StyledContainer = styled(Container)`
    &&& {
        button {
            width: 100%;
            margin-top: 40px;
        }
    }

    .shared-passphrase-list {
        margin: 50px 0 20px 0;
    }
`;

export default () => {
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='createAccount.setupPassphrase.sharedPassphrase.tite' /></h1>
            <h2><Translate id='createAccount.setupPassphrase.sharedPassphrase.desc' data={{ numberOfAccounts: '2' }}/></h2>
            <h2><Translate id='createAccount.setupPassphrase.sharedPassphrase.descTwo' /></h2>
            <SharedPassphraseList
                newAccount='someNewAccount.near'
                sharedAccounts={['account1.near', 'account2.near']}
            />
            <FormButton
                onClick={() => { }}
            >
                <Translate id='button.acceptAndContinue' />
            </FormButton>
        </StyledContainer>
    );
};