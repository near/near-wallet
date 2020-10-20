import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import WalletIcon from '../../svg/WalletIcon'
import LockIcon from '../../svg/LockIcon'
import Balance from '../../common/Balance'
import ChevronIcon from '../../svg/ChevronIcon'

const Container = styled.div`
    position: relative;
    margin-bottom: 135px;

    .wrapper {
        position: absolute;
        width: 100%;
        background-color: white;
        border: 2px solid #F2F2F2;
        border-radius: 4px;
        cursor: pointer;
        z-index: 1;
    }

    .selected {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .account {
            width: 100%;
            margin-right: -33px;
            
            :hover {
                background-color: transparent;
            }
        }

        > svg {
            margin-right: 25px;
            transform: rotate(-90deg);
        }
    }

    .account {
        display: flex;
        align-items: center;
        padding: 15px;

        :hover {
            background-color: #FAFAFA;
        }

        .content {
            margin-left: 15px;
            color: #24272a;

            div {
                :first-of-type {
                    margin-bottom: 8px;
                    font-weight: 500;
                    span {
                        color: #D4D3D9;
                    }
                }
            }

            .list {
                color: #48DBA7;
            }
        }
    }
`

function Account({ account, onClick }) {
    return (
        <div className='account' onClick={() => onClick(account.accountId)}>
            <LockIcon/>
            <div className='content'>
                <div>
                    {account.accountId.split('.')[0]}<span>.{account.accountId.substring(account.accountId.indexOf('.') + 1)}</span>
                </div>
                <Balance noSymbol='near' amount={account.balance}/>
            </div>
        </div>
    )
}

export default function AccountSwitcher({ open, activeAccount, accounts, handleOnClick }) {
    let lockupAccount = {
        accountId: 'fiiiiiiirst.asdad.lockup.near',
        balance: '1223423423432432423422343234'
    }

    let noLockupAccount = {
        accountId: 'seeeccond.near',
        balance: '1223423423432432423422343234'
    }

    return (
        <Container>
            <div className='wrapper'>
                <div className='selected'>
                    <Account account={lockupAccount} onClick={handleOnClick}/>
                    <ChevronIcon color='#0072CE'/>
                </div>
                {open &&
                    <div className='accounts'>
                        <Account account={lockupAccount} onClick={handleOnClick}/>
                        <Account account={noLockupAccount} onClick={handleOnClick}/>
                    </div>
                }
            </div>
        </Container>
    )
}