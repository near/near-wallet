import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import UserIconColor from '../../svg/UserIconColor';
import Account from './Account';

const StyledContainer = styled.div`
    &&& {
        .accounts {
            max-height: 279px;
            overflow-y: auto;
            ::-webkit-scrollbar {
                display: none;
            }
        }

        > button {
            width: 100%;
            margin-top: 30px;
        }

        &.no-account {
            background-color: #F0F0F1;
            color: #72727A;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;

            > svg {
                margin-top: 10px;
                circle {
                    fill: white;
                }
            }

            > div {
                max-width: 220px;
                margin: 15px 0 10px 0;
            }
        }
    }
`;

export default ({
    signedInAccountId,
    signedInAccountAvailableBalance,
    availableAccounts,
    accountsBalances,
    getAccountBalance,
    onSelectAccount,
    onSignInToDifferentAccount
}) => {

    if (!signedInAccountId) {
        return (
            <StyledContainer className='no-account pg-20 brs-8'>
                <UserIconColor />
                <div><Translate id='accountSelector.noAccountDesc' /></div>
                <FormButton
                    onClick={() => { }}
                >
                    <Translate id='button.signIn' />
                </FormButton>
            </StyledContainer>
        );
    }
    // TODO: Add loading animation while switching account
    return (
        <StyledContainer className='pg-20 brs-8 bsw-l'>
            <div className='accounts'>
                <Account
                    accountId={signedInAccountId}
                    balance={signedInAccountAvailableBalance}
                    active={true}
                    defaultShowBalance={true}
                />
                {availableAccounts.filter(a => a !== signedInAccountId).map((accountId) =>
                    <Account
                        key={accountId}
                        accountId={accountId}
                        balance={accountsBalances && accountsBalances[accountId]?.balanceAvailable}
                        onSelectAccount={() => onSelectAccount(accountId)}
                        onToggleShowBalance={() => getAccountBalance(accountId)}
                    />
                )}
            </div>
            <FormButton
                onClick={onSignInToDifferentAccount}
                color='gray-blue'
            >
                <Translate id='accountSelector.signInButton' />
            </FormButton>
        </StyledContainer>
    );
};