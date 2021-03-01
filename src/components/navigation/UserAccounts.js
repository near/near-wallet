import React from 'react'
import styled from 'styled-components'

import Balance from '../common/Balance'
import SkeletonLoading from '../common/SkeletonLoading';

import IconRefresh from '../../images/icon-nodes.svg'

const Wrapper = styled.div`
    .animation-wrapper > .animation {
        border-radius: 8px;
    }

    @media (min-width: 992px) {
        max-height: 228px;
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
    position: relative;

    @media (min-width: 992px) {
        :hover {
            color: #0072CE;

            &.additional-account {
                .balance {
                    color: #0072CE;
                }
            }
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

    .balance {
        color: #00C08B;
        font-weight: 400;
    }

    &.additional-account {
        :last-of-type {
            border-bottom: 0;
        }

        .refresh {
            position: absolute;
            width: 20px;
            height: 100%;
            top: 0px;
            right: 0px;
            background: url(${IconRefresh}) no-repeat center 34px;
            background-size: 20px auto;
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
                            <span className='refresh' onClick={() => refreshBalance(account)} title='Refresh balance' />
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

export default UserAccounts
