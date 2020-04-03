import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`

    @media (min-width: 992px) {
        max-height: 150px;
        overflow-y: auto;
    }
    
    div {
        margin-top: 5px;
        color: #999;
    }
`

const Account = styled(Link)`
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    padding: 12px 0;
    border-bottom: 1px solid #404040;

    :last-of-type {
        border-bottom: 0;
    }

    :hover {
        color: white;
        text-decoration: none;
    }

    @media (min-width: 992px) {
        color: #4a4f54;
        border-bottom: 2px solid #e6e6e6;

        :hover {
            color: #0072CE;
            text-decoration: none;
        }
    }
`

const UserAccounts = ({ accounts, accountId, selectAccount }) => (
    <Wrapper>
        {accounts.filter(a => a !== accountId).map((account, i) => (
            <Account key={`link-${i}`} onClick={() => selectAccount(account)} to='/'>
                @{account}
            </Account>
        ))}
        {accounts.length < 2 && <div>You have no other accounts</div>}
    </Wrapper>
)

export default UserAccounts;