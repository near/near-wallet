import React, { useState } from 'react'
import styled from 'styled-components'
import AccountId from './AccountId'
import Balance from '../../common/Balance'
import InfoPopup from '../../common/InfoPopup'
import { Translate } from 'react-localize-redux'
import ChevronIcon from '../../svg/ChevronIcon'

const Container = styled.div`
    margin: 0 -14px;

    h4 {
        font-size: 14px;
    }
    
    .title {
        &.last {
            margin-top: 30px;
        }
    }

    .title, .total, .item {
        display flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 14px;
    }

    .total {
        border-top: 1px solid #f3f3f3;
        font-weight: 500;
    }

    .item {
        color: #72727A;
        border-bottom: 1px solid #f3f3f3;
        background-color: #FAFAFA;
        padding-left: 28px;

        span {
            display: flex;
            align-items: center;
            :last-of-type {
                font-weight: 500;
            }
        }

        &.first {
            box-shadow: inset 0 5px 6px -5px #dedede;
        }

        &.detail {
            background-color: #F0F0F0;
            border-color: #e6e6e6;
            padding-left: 42px;

            &:first-of-type {
                box-shadow: inset 0 5px 6px -5px #dedede;
            }

            &:last-of-type {
                border-color: #f3f3f3;
            }

            &.locked {
                padding-left: 56px;
            }
        }

        &.locked {
            padding-left: 42px;
        }
    }

    .chevron-icon {
        transform: rotate(90deg);
        margin-left: 12px;
        width: 8px;
        height: 12px;
        margin-top: 2px;
    }
`

const BalanceContainer = ({ account }) => {
    return (
        <Container>
            <div className='title'>
                <h4>Wallet ID</h4>
                <AccountId id={account.accountId}/>
            </div>
            <div className='total'>
                <span>Wallet balance</span>
                <Balance amount={account.balance.available} symbol='near'/>
            </div>
            <div className='item first'>
                <span>Reserved for storage <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='item'>
                <span>In staking pools <ChevronIcon color='#0072ce'/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='expand'>
                <div className='item detail'>
                    <span>Staked</span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <div className='item detail'>
                    <span>Unstaked <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
            </div>
            <div className='item'>
                <span>Available <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='title last'>
                <h4>Lockup ID</h4>
                <AccountId id={account.accountId}/>
            </div>
            <div className='total'>
                <span>Lockup balance</span>
                <Balance amount={account.balance.available} symbol='near'/>
            </div>
            <div className='item first'>
                <span>Reserved for storage <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='item'>
                <span>Locked <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='item locked'>
                <span>In staking pools <ChevronIcon color='#0072ce'/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='expand'>
                <div className='item detail locked'>
                    <span>Staked</span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <div className='item detail locked'>
                    <span>Unstaked <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
            </div>
            <div className='item'>
                <span>Unlocked <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='item locked'>
                <span>In staking pools <ChevronIcon color='#0072ce'/></span>
                <span><Balance amount={account.balance.available} symbol='near'/></span>
            </div>
            <div className='expand'>
                <div className='item detail locked'>
                    <span>Staked</span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <div className='item detail locked'>
                    <span>Unstaked <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
            </div>
        </Container>
    )
}

export default BalanceContainer