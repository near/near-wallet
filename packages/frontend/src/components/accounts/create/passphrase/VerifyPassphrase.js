import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    &&& {
        button {
            width: 100%;
            margin-top: 50px;
        }
    }

    .input-label {
        margin-top: 50px;
    }
`;

export default () => {
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='createAccount.setupPassphrase.verifyPassphrase.tite' /></h1>
            <h2><Translate id='createAccount.setupPassphrase.verifyPassphrase.desc' /></h2>
            <div className='input-label'><Translate id='createAccount.setupPassphrase.verifyPassphrase.yourPassphrase' /></div>
            <Translate>
                {({ translate }) => (
                    <textarea placeholder={translate('createAccount.setupPassphrase.verifyPassphrase.passPhrasePlaceholder')} />
                )}
            </Translate>
            <FormButton
                onClick={() => { }}
            >
                <Translate id='button.verify' />
            </FormButton>
        </StyledContainer>
    );
};