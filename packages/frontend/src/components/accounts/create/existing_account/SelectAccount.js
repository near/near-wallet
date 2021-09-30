import BN from 'bn.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { MIN_BALANCE_TO_CREATE } from '../../../../utils/wallet';
import FormButtonGroup from '../../../common/FormButtonGroup';
import Container from '../../../common/styled/Container.css';
import AccountSelector from '../../account_selector/AccountSelector';

const StyledContainer = styled(Container)`
    .button-group {
        margin-top: 25px;
    }
`;

export default ({
    signedInAccountId,
    signedInAccountAvailableBalance,
    availableAccounts,
    accountsBalances,
    getAccountBalance,
    onSelectAccount,
    onSignInToDifferentAccount,
    onClickPrimary,
    onClickSecondary,
    hasAllRequiredParams
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='existingAccount.selectAccount.title' /></h1>
            <h2><Translate id='existingAccount.selectAccount.desc' data={{ amount: formatNearAmount(MIN_BALANCE_TO_CREATE) }}/></h2>
            <h2><Translate id='existingAccount.selectAccount.descTwo' /></h2>
            <AccountSelector
                signedInAccountId={signedInAccountId}
                availableAccounts={availableAccounts}
                accountsBalances={accountsBalances}
                getAccountBalance={getAccountBalance}
                onSelectAccount={onSelectAccount}
                onSignInToDifferentAccount={onSignInToDifferentAccount}
            />
            <FormButtonGroup
                onClick={{
                    primary: onClickPrimary,
                    secondary: onClickSecondary
                }}
                disabled={{
                    primary: !hasAllRequiredParams || !new BN(signedInAccountAvailableBalance).gte(new BN(MIN_BALANCE_TO_CREATE))
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