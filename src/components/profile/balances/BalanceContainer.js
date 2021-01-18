import React from 'react'
import styled from 'styled-components'
import AccountId from './AccountId'
import Balance from '../../common/Balance'
import InfoPopup from '../../common/InfoPopup'
import Accordion from '../../common/Accordion'
import ClickToCopy from '../../common/ClickToCopy'
import { Translate } from 'react-localize-redux'
import ChevronIcon from '../../svg/ChevronIcon'

const Container = styled.div`
    margin: 0 -14px;

    .border-box {

        @media (min-width: 768px) {
            border: 2px solid #F0F0F0;
            border-radius: 8px;
        }

        :first-of-type {
            margin-top: 50px;

            @media (max-width: 767px) {
                margin-top: 20px;
            }
        }

        :last-of-type {
            margin-top: 30px;
        }

        @media (min-width: 768px) {
            > .item {
                :last-of-type {
                    border-bottom: 0;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
            }
        }
    }

    h4 {
        font-size: 14px;
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

        &.button {
            cursor: pointer;
            font-weight: 400 !important;

            &.open {
                .chevron-icon {
                    transform: rotate(-90deg) !important;
                }
            }
        }

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

            @media (min-width: 768px) {
                &.last {
                    border-bottom: 0;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
            }
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

const BalanceContainer = ({ account, profileBalance, balanceLoader }) => {
    // TODO: add loader, as it takes few seconds to load data - use `balanceLoader`
    return (
        <Container>
            {profileBalance && 
                <>
            <div className='border-box'>
                <div className='title'>
                    <h4><Translate id='profile.account.walletId'/></h4>
                    <ClickToCopy copy={account.accountId}>
                        <AccountId id={account.accountId}/>
                    </ClickToCopy>
                </div>
                <div className='total'>
                    <span><Translate id='profile.account.walletBalance'/></span>
                    <Balance amount={account.balance.available} symbol='near'/>
                </div>
                <div className='item first'>
                    <span><Translate id='profile.account.reservedForStorage'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <div className='item button' id='balance-1'>
                    <span><Translate id='profile.account.inStakingPools'/> <ChevronIcon color='#0072ce'/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <Accordion trigger='balance-1'>
                    <div className='item detail'>
                        <span><Translate id='profile.account.staked'/></span>
                        <span><Balance amount={account.balance.available} symbol='near'/></span>
                    </div>
                    <div className='item detail'>
                        <span><Translate id='profile.account.unstaked'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                        <span><Balance amount={account.balance.available} symbol='near'/></span>
                    </div>
                </Accordion>
                <div className='item'>
                    <span><Translate id='profile.account.available'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
            </div>
                    {profileBalance.lockupIdExists && 
            <div className='border-box'>
                <div className='title last'>
                    <h4><Translate id='profile.lockup.lockupId'/></h4>
                    <ClickToCopy copy={account.accountId}>
                        <AccountId id={account.accountId}/>
                    </ClickToCopy>
                </div>
                <div className='total'>
                    <span><Translate id='profile.lockup.lockupBalance'/></span>
                    <Balance amount={account.balance.available} symbol='near'/>
                </div>
                <div className='item first'>
                    <span><Translate id='profile.account.reservedForStorage'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <div className='item'>
                    <span><Translate id='profile.lockup.locked'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <div className='item locked button' id='balance-2'>
                    <span><Translate id='profile.account.inStakingPools'/> <ChevronIcon color='#0072ce'/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <Accordion trigger='balance-2'>
                    <div className='item detail locked'>
                        <span><Translate id='profile.account.staked'/></span>
                        <span><Balance amount={account.balance.available} symbol='near'/></span>
                    </div>
                    <div className='item detail locked'>
                        <span><Translate id='profile.account.unstaked'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                        <span><Balance amount={account.balance.available} symbol='near'/></span>
                    </div>
                </Accordion>
                <div className='item'>
                    <span><Translate id='profile.lockup.unlocked'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <div className='item locked button last' id='balance-3'>
                    <span><Translate id='profile.account.inStakingPools'/> <ChevronIcon color='#0072ce'/></span>
                    <span><Balance amount={account.balance.available} symbol='near'/></span>
                </div>
                <Accordion trigger='balance-3'>
                    <div className='item detail locked'>
                        <span><Translate id='profile.account.staked'/></span>
                        <span><Balance amount={account.balance.available} symbol='near'/></span>
                    </div>
                    <div className='item detail locked'>
                        <span><Translate id='profile.account.unstaked'/> <InfoPopup content={<Translate id='profile.pageTitle.notFound'/>}/></span>
                        <span><Balance amount={account.balance.available} symbol='near'/></span>
                    </div>
                </Accordion>
            </div>
                    }
                </>
            }
        </Container>
    )
}

export default BalanceContainer