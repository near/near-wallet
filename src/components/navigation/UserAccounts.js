import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';

const Wrapper = styled.div`
    @media (min-width: 992px) {
        max-height: 150px;
        overflow-y: auto;
    }
`

const Account = styled.div`
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    padding: 12px 14px;
    border-bottom: 1px solid #404040;
    cursor: pointer;
    font-weight: 500;

    :first-of-type {
        background-color: #24272a;
        padding: 18px 14px;
        margin-bottom: 10px;
        border-radius: 8px;
    }

    :last-of-type {
        border-bottom: 0;
    }

    @media (min-width: 992px) {
        color: #24272a;
        border-bottom: 2px solid #e6e6e6;

        :hover {
            color: #0072CE;
        }
    }
`

const UserAccounts = ({ accounts, accountId, selectAccount }) => (
    <Wrapper>
        <Account>
            {accountId}
        </Account>
        {accounts.filter(a => a !== accountId).map((account, i) => (
            <Account key={`link-${i}`} onClick={() => selectAccount(account)}>
                {account}
            </Account>
        ))}
    </Wrapper>
)

export default UserAccounts;