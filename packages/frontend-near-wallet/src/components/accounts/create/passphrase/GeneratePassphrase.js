import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import RecoveryOption from '../../../accounts/recovery_setup/RecoveryOption';
import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    .active {
        hr {
            display none;
        }
    }
    h2 {
        :last-of-type {
            margin-bottom: 40px;
        }
    }
    &&& {
        button {
            width: 100%;
            margin-top: 40px;
        }
    }
`;

export default () => {
    const [recoveryOption, setRecoveryOption] = useState('newPhrase');
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='createAccount.setupPassphrase.generatePassphrase.tite' /></h1>
            <h2><Translate id='createAccount.setupPassphrase.generatePassphrase.desc' /></h2>
            <h2><Translate id='createAccount.setupPassphrase.generatePassphrase.descTwo' /></h2>
            <RecoveryOption
                onClick={() => setRecoveryOption('newPhrase')}
                option='newPhrase'
                active={recoveryOption}
            />
            <RecoveryOption
                onClick={() => setRecoveryOption('existingPhrase')}
                option='existingPhrase'
                active={recoveryOption}
            />
            <FormButton
                onClick={() => {}}
            >
                <Translate id='button.continue' />
            </FormButton>
        </StyledContainer>
    );
};
