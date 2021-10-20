import BN from 'bn.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { MIN_BALANCE_TO_CREATE } from '../../../../config';
import FormButton from '../../../common/FormButton';
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
    onClickNext,
    onClickCancel,
    hasAllRequiredParams
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='existingAccount.selectAccount.title' /></h1>
            <h2><Translate id='existingAccount.selectAccount.desc' data={{ amount: formatNearAmount(MIN_BALANCE_TO_CREATE) }} /></h2>
            <h2><Translate id='existingAccount.selectAccount.descTwo' /></h2>
            <AccountSelector
                signedInAccountId={signedInAccountId}
                availableAccounts={availableAccounts}
                accountsBalances={accountsBalances}
                getAccountBalance={getAccountBalance}
                onSelectAccount={onSelectAccount}
                onSignInToDifferentAccount={onSignInToDifferentAccount}
                showBalanceInUSD={false}
            />
            <FormButtonGroup>
                <FormButton
                    onClick={onClickCancel}
                    color='gray-blue'
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickNext}
                    disabled={!hasAllRequiredParams || !new BN(signedInAccountAvailableBalance).gte(new BN(MIN_BALANCE_TO_CREATE))}
                >
                    <Translate id='button.next' />
                </FormButton>
            </FormButtonGroup>
        </StyledContainer>
    );
};