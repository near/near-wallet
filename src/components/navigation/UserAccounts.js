import React from 'react'
import styled from 'styled-components'

import Balance from '../common/Balance'
import SkeletonLoading from '../common/SkeletonLoading';
import classNames from '../../utils/classNames'
import { Translate } from 'react-localize-redux'

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
    padding: 16px;
    cursor: pointer;
    font-weight: 500;
    position: relative;

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
        flex-direction: column;
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

const UserAccounts = ({ accounts, accountId, selectAccount, accountIdLocalStorage, accountsBalance, balance, refreshBalance }) => (
    <Wrapper>
        <Account className='active-account'>
          <div className="account-data">
            {accountId || accountIdLocalStorage}
            <div className='balance'>
                <Balance amount={balance?.available} />
            </div>
          </div>
        </Account>
        {accountId
            ? accounts.filter(a => a !== accountId).map((account, i) => (
                <Account key={`link-${i}`} className='additional-account'>
                    <div className='account-data' onClick={() => selectAccount(account)}>
                        <div className='accountId'>
                            {account}
                        </div>
                        <div className='balance'>
                            {accountsBalance 
                                && (accountsBalance[account]?.loading || accountsBalance[account]?.available)
                                    ? <Balance amount={accountsBalance[account]?.available} />
                                    : <div className='symbol'>Ⓝ</div>
                            }
                        </div>
                    </div>
                    <div>
                        <SyncButton 
                            className={classNames([{'dots': !(accountsBalance && !accountsBalance[account]?.loading)}])} 
                            onClick={() => refreshBalance(account)} 
                            title='Sync balance'
                        >
                            {accountsBalance && accountsBalance[account]?.loading
                                ? ''
                                : <Translate id='sync'/>
                            }
                        </SyncButton>
                    </div>
                </Account>
            )) : <SkeletonLoading
                height='55px'
                show={true}
            />
        }
    </Wrapper>
)

export default UserAccounts
