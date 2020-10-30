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
    padding: 12px 0;
    border-bottom: 1px solid #404040;
    cursor: pointer;

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
        {accounts.filter(a => a !== accountId).map((account, i) => (
            <Account key={`link-${i}`} onClick={() => selectAccount(account)}>
                {account}
            </Account>
        ))}
        {accounts.length < 2 && <div><Translate id='link.noAccount'/></div>}
    </Wrapper>
)

export default UserAccounts;