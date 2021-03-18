import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    @media (min-width: 992px) {
        max-height: 200px;
        overflow-y: auto;

        ::-webkit-scrollbar {
            display: none;
        }
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
        background-color: #EAF3FE;
        border-radius: 8px;
        cursor: default;
        border: 2px solid #BED0EA;
        color: black;
    }

    &.additional-account {
        :last-of-type {
            border-bottom: 0;
        }
    }
`

const UserAccounts = ({ accounts, accountId, selectAccount }) => (
    <Wrapper>
        <Account>
            {accountId}
        </Account>
        {accounts.filter(a => a !== accountId).map((account, i) => (
            <Account key={`link-${i}`} onClick={() => selectAccount(account)} className='additional-account'>
                {account}
            </Account>
        ))}
    </Wrapper>
)

export default UserAccounts;