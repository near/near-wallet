import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { actionsPending } from '../../utils/alerts';
import classNames from '../../utils/classNames';
import Balance from '../common/balance/Balance';
import SkeletonLoading from '../common/SkeletonLoading';

const Wrapper = styled.div`
    .animation-wrapper > .animation {
        border-radius: 8px;
    }

    @media (min-width: 992px) {
        max-height: 260px;
        overflow-y: auto;

        ::-webkit-scrollbar {
            display: none;
        }
    }
`;

const Account = styled.div`
    align-items: center;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    color: #72727A;
    margin-bottom: 4px;
    padding: 16px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 8px;

      .accountId {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .balance-wrapper {
      font-weight: 400;
      line-height: normal;
      margin-top: 2px;
    }
`;

const SyncButton = styled.span`
    background-color: #f8f8f8;
    border-radius: 50px;
    color: #0072ce;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    cursor: pointer;
    flex-basis: content;
    flex-shrink: 0;

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
`;

const UserAccounts = ({ accounts, accountId, accountIdLocalStorage, handleSelectAccount, accountsBalance, balance, refreshBalance, getBalance }) => (
    <Wrapper>
        <UserAccount
            accountId={accountId || accountIdLocalStorage}
            balance={actionsPending('GET_BALANCE') ? '' : balance?.total}
            balanceLoading={actionsPending('GET_BALANCE')}
            refreshBalance={() => {
                getBalance();
                refreshBalance(accountId);
            }}
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
                    onClick={() => handleSelectAccount(account)}
                />
            )) : <SkeletonLoading
                height='55px'
                show={true}
            />
        }
    </Wrapper>
);

const UserAccount = ({ accountId, balance, balanceLoading, refreshBalance, active, onClick }) => (
    <Account className={active ? 'active-account' : 'additional-account'} onClick={onClick}>
        <div className='account-data'>
            <div className='accountId'>
                {accountId}
            </div>
            <div className='balance-wrapper'>
                {!balance && !balanceLoading
                    ? <div>— USD</div>
                    : <Balance amount={balance} showBalanceInNEAR={false} showAlmostEqualSignUSD={false}/>
                }
            </div>
        </div>
        <SyncButton 
            className={classNames([{'dots': balanceLoading}])}
            onClick={e => {
                refreshBalance();
                e.stopPropagation();
            }}
            title='Sync balance'
        >
            {balance
                ? <Translate id='sync'/>
                : !balanceLoading
                    ? <Translate id='getBalance'/>
                    : ''
            }
        </SyncButton>
    </Account>
);

export default UserAccounts;
