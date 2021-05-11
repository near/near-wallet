import React from 'react'
import styled from 'styled-components'

import Balance from '../common/Balance'
import SkeletonLoading from '../common/SkeletonLoading';
import classNames from '../../utils/classNames'
import { Translate } from 'react-localize-redux'
import { actionsPending } from '../../utils/alerts'

const Wrapper = styled.div`
    .animation-wrapper > .animation {
        border-radius: 8px;
    }

    @media (min-width: 992px) {
        display: flex;
        flex-direction: column;
        max-height: 228px;
        overflow-y: auto;

        ::-webkit-scrollbar {
            display: none;
        }
    }
`

const Account = styled.div`
    align-items: center;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    text-overflow: ellipsis;
    color: #72727A;
    margin-bottom: 4px;
    cursor: pointer;
    font-weight: 500;
    position: relative;
    
    .symbol {
        transform: scale(0.65);
        font-weight: 700;
        margin-left: -2%;
        float: left;
    }

    @media (min-width: 992px) {
        :hover {
            background-color: #f8f8f8;

            .accountId {
                color: black;
            }
        }
    }

    &.active-account {
        color: white;
        background-color: #ECFDF5;
        border-radius: 8px;
        cursor: default;
        color: black;

        .balance {
            color: #008D6A;
        }
    }

    .account-data {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 16px 0 16px 16px;
    }
    .sync {
        padding: 0 16px 0 0;
    }

    .balance {
      font-weight: 400;
    }
`

const SyncButton = styled.span`
    background-color: #f8f8f8;
    border-radius: 50px;
    border: 2px solid #f8f8f8;
    color: #0072ce;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    cursor: pointer;

    :hover, :active {
        background-color: #F0F0F1;
        border-color: #F0F0F1;
    }

    &.dots {
        color: #0072ce;
        margin: 0 12px 0 0;
        padding: 0 12px 0 6px;

        :after {
            content: '.';
            animation: link 1s steps(5, end) infinite;

            @keyframes link {
                0%, 20% {
                    color: rgba(0,0,0,0);
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                40% {
                    color: #0072ce;
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                60% {
                    text-shadow:
                        .3em 0 0 #0072ce,
                        .6em 0 0 rgba(0,0,0,0);
                }
                80%, 100% {
                    text-shadow:
                        .3em 0 0 #0072ce,
                        .6em 0 0 #0072ce;
                }
            }
        }
    }
`

const UserAccounts = ({ accounts, accountId, accountIdLocalStorage, selectAccount, accountsBalance, balance, refreshBalance, getBalance }) => (
    <Wrapper>
        <UserAccount
            accountId={accountId || accountIdLocalStorage}
            balance={actionsPending('GET_BALANCE') ? '' : balance?.total}
            balanceLoading={actionsPending('GET_BALANCE')}
            refreshBalance={() => (getBalance(), refreshBalance(accountId))}
            active={true}
        />
        {accountId
            ? accounts.filter(a => a !== accountId).map((account, i) => (
                <UserAccount
                    key={i}
                    accountId={account}
                    balance={accountsBalance && accountsBalance[account]?.total}
                    balanceLoading={accountsBalance && accountsBalance[account]?.loading}
                    refreshBalance={() => refreshBalance(account)}
                    active={false}
                    onClick={() => selectAccount(account)}
                />
            )) : <SkeletonLoading
                height='55px'
                show={true}
            />
        }
    </Wrapper>
)

const UserAccount = ({ accountId, balance, balanceLoading, refreshBalance, active, onClick }) => (
    <Account className={active ? 'active-account' : 'additional-account'}>
        <div className='account-data' onClick={onClick}>
            <div className='accountId'>
                {accountId}
            </div>
            <div className='balance'>
                {!balance && !balanceLoading
                    ? <div className='symbol'>Ⓝ</div>
                    : <Balance amount={balance} />
                }
            </div>
        </div>
        <div className='sync'>
            <SyncButton 
                className={classNames([{'dots': balanceLoading}])}
                onClick={refreshBalance}
                title='Sync balance'
            >
                {balance
                    ? <Translate id='sync'/>
                    : !balanceLoading
                        ? <Translate id='getBalance'/>
                        : ''
                }
            </SyncButton>
        </div>
    </Account>
)

export default UserAccounts
