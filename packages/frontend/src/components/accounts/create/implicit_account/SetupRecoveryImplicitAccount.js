import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import RecoveryOption from '../../../accounts/recovery_setup/RecoveryOption';
import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import Tooltip from '../../../common/Tooltip';

const StyledContainer = styled(Container)`
    &&& {
        button {
            margin-top: 50px;
            width: 100%;
        }
    
        h4 {
            margin-top: 40px;
            font-weight: 600;
            font-size: 15px;
            display: flex;
            align-items: center;
        }
    }
`;

export default ({
    onClickSecureMyAccount
}) => {
    const [recoveryOption, setRecoveryOption] = useState('phrase');
    return (
        <StyledContainer className='small-centered border'>
            <form onSubmit={e => {
                onClickSecureMyAccount({ recoveryOption });
                e.preventDefault();
            }}>
                <h1><Translate id='setupRecovery.header' /></h1>
                <h2><Translate id='setupRecovery.subHeader' /></h2>
                <h4>
                    <Translate id='setupRecovery.advancedSecurity' />
                    <Tooltip translate='profile.security.mostSecureDesc' icon='icon-lg' />
                </h4>
                <RecoveryOption
                    onClick={() => setRecoveryOption('phrase')}
                    option='phrase'
                    active={recoveryOption}
                />
                <RecoveryOption
                    onClick={() => setRecoveryOption('ledger')}
                    option='ledger'
                    active={recoveryOption}
                />
                <FormButton
                    color='blue'
                    type='submit'
                    trackingId='SR Click submit button'
                    data-test-id="submitSelectedRecoveryOption"
                >
                    <Translate id='button.secureMyAccount' />
                </FormButton>
            </form>
        </StyledContainer >
    );
};