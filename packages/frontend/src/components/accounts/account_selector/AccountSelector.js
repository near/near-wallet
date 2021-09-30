import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import ImportIcon from '../../svg/ImportIcon';
import UserIconColor from '../../svg/UserIconColor';
import Account from './Account';

const StyledContainer = styled.div`
    &&& {
        .accounts {
            max-height: 280px;
            overflow-y: auto;
            ::-webkit-scrollbar {
                display: none;
            }
        }

        > button {
            width: 100%;
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            > svg {
                min-height: 22px;
                min-width: 22px;
                margin: 0 6px 0 0;
                path {
                    stroke: #0072ce;
                }
            }
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
    availableAccounts,
    accountsBalances,
    getAccountBalance,
    onSelectAccount,
    onSignInToDifferentAccount,
    showBalanceInUSD
}) => {



    if (!signedInAccountId && onSignInToDifferentAccount) {
        return (
            <StyledContainer className='no-account pg-20 brs-8'>
                <UserIconColor />
                <div><Translate id='accountSelector.noAccountDesc' /></div>
                <FormButton
                    onClick={onSignInToDifferentAccount}
                >
                    <Translate id='button.importAccount' />
                </FormButton>
            </StyledContainer>
        );
    }
    return (
        <StyledContainer className='pg-20 brs-8 bsw-l account-selector'>
            <div className='accounts'>
                <Account
                    accountId={signedInAccountId}
                    balance={accountsBalances && accountsBalances[signedInAccountId]?.balanceAvailable}
                    active={true}
                    showBalanceInUSD={showBalanceInUSD}
                    onToggleShowBalance={() => getAccountBalance(signedInAccountId)}
                />
                {availableAccounts.filter(a => a !== signedInAccountId).map((accountId) =>
                    <Account
                        key={accountId}
                        accountId={accountId}
                        balance={accountsBalances && accountsBalances[accountId]?.balanceAvailable}
                        onSelectAccount={() => {
                            onSelectAccount(accountId);
                            getAccountBalance(accountId);
                        }}
                        onToggleShowBalance={() => getAccountBalance(accountId)}
                        showBalanceInUSD={showBalanceInUSD}
                    />
                )}
            </div>
            {onSignInToDifferentAccount &&
                < FormButton
                    onClick={onSignInToDifferentAccount}
                    color='gray-blue'
                >
                    <ImportIcon />
                    <Translate id='accountSelector.signInButton' />
                </FormButton>
            }
        </StyledContainer >
    );
};