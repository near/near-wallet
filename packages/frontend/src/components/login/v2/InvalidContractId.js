import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import LoginStyle from './style/LoginStyle.css';

export default ({ invalidContractId, onClickReturnToApp }) => (
    <Container className='small-centered border'>
        <LoginStyle className='invalid-contract'>
            <h3><Translate id='account.login.incorrectContractId.errorTitle' /></h3>
            <div className='desc'>
                <Translate id='account.login.incorrectContractId.error' data={{ contractId: invalidContractId }} />
            </div>
            <FormButton
                onClick={onClickReturnToApp}
            >
                <Translate id='button.returnToApp' />
            </FormButton>
        </LoginStyle>
    </Container>
);