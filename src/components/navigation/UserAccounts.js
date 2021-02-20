import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';

const Wrapper = styled.div`
    @media (min-width: 992px) {
        max-height: 200px;
        overflow-y: auto;

        ::-webkit-scrollbar {
            display: none;
        }
    }

    .no-account {
        color: #72727A;
        margin-top: 18px;
    }
`

const Account = styled.div`
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #72727A;
    padding: 18px 14px;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    font-weight: 500;
    transition: 100ms;

    @media (min-width: 992px) {
        :hover {
            color: #0072CE;
        }
    }

    :first-of-type {
        color: white;
        background-color: #272729;
        border-radius: 8px;
        cursor: default;

        :hover {
            color: white;
        }
    }

    :last-of-type {
        border-bottom: 0;
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
        {accounts.length < 2 && 
            <div className='no-account'><Translate id='link.noAccount'/></div>
        }
    </Wrapper>
)

export default UserAccounts;