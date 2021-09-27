import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { MIN_BALANCE_TO_CREATE } from '../../../../utils/wallet';
import FormButtonGroup from '../../../common/FormButtonGroup';
import Container from '../../../common/styled/Container.css';
import AccountSelector from '../../account_selector/AccountSelector';

const StyledContainer = styled(Container)`
    .form-button-group {
        margin-top: 25px;
    }
`;

export default ({
    onClickPrimary,
    onClickSecondary
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='existingAccount.selectAccount.title' /></h1>
            <h2><Translate id='existingAccount.selectAccount.desc' data={{ amount: formatNearAmount(MIN_BALANCE_TO_CREATE) }}/></h2>
            <h2><Translate id='existingAccount.selectAccount.descTwo' /></h2>
            <AccountSelector/>
            <FormButtonGroup
                onClick={{
                    primary: onClickPrimary,
                    secondary: onClickSecondary
                }}
                color={{
                    secondary: 'gray-blue'
                }}
                translateId={{
                    primary: 'button.next',
                    secondary: 'button.cancel'
                }}
            />
        </StyledContainer>
    );
};