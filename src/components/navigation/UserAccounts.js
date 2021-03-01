import React from 'react';
import styled from 'styled-components';
import SkeletonLoading from '../common/SkeletonLoading';
import Balance from '../common/Balance'

const Wrapper = styled.div`
    .animation-wrapper > .animation {
        border-radius: 8px;
    }

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

const UserAccounts = ({ accounts, accountId, selectAccount, accountIdLocalStorage, accountsBalance, balance, refreshBalance }) => (
    <Wrapper>
        <Account>
            {accountId || accountIdLocalStorage}
            <div className='balance'>
                <Balance amount={balance?.available} />
            </div>
        </Account>
        {accountId
            ? accounts.filter(a => a !== accountId).map((account, i) => (
                <Account key={`link-${i}`} className='additional-account'>
                    <div onClick={() => selectAccount(account)}>
                        <div>
                            {account}
                        </div>
                        <div className='balance'>
                            <Balance amount={accountsBalance && accountsBalance[account]?.available} />
                        </div>
                    </div>
                    <div>
                        {accountsBalance && accountsBalance[account]?.available && (
                            <div className='refresh' onClick={() => refreshBalance(account)}>
                                <span>refresh</span>
                            </div>
                        )}
                    </div>
                </Account>
            )) : <SkeletonLoading
                height='55px'
                show={true}
            />
        }
    </Wrapper>
)

export default UserAccounts;