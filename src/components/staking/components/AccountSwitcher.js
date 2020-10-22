import React from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import WalletIcon from '../../svg/WalletIcon'
import LockIcon from '../../svg/LockIcon'
import Balance from '../../common/Balance'
import ChevronIcon from '../../svg/ChevronIcon'

const Container = styled.div`
    position: relative;
    height: 70px;

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
            pointer-events: none;
            transform: ${props => props.open ? 'rotate(-90deg)' : 'rotate(90deg)'};
        }
    }

    .account {
        display: flex;
        align-items: center;
        padding: 15px;

        :hover {
            background-color: #FAFAFA;
        }

        .lock-icon {
            width: 26px;
            height: 26px;
        }

        .content {
            margin-left: 15px;
            color: #24272a;

            div {
                :first-of-type {
                    margin-bottom: 8px;
                    font-weight: 500;
                    max-width: 260px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 120%;
                    span {
                        color: #D4D3D9;
                    }
                }
            }

            .list {
                color: #00C08B;
            }
        }
    }
`

function Account({ account, onClick, mainAccountId }) {
    const accountId = account.accountId
    const isLockup = account.accountId !== mainAccountId

    if (accountId) {
        return (
            <div className='account' onClick={() => onClick(accountId)}>
                {isLockup ? <LockIcon/> : <WalletIcon/>}
                <div className='content'>
                    <div>
                        {accountId.split('.')[0]}<span>.{accountId.substring(accountId.indexOf('.') + 1)}</span>
                    </div>
                    <Balance noSymbol='near' amount={account.totalUnstaked || '0'}/>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default function AccountSwitcher({ open, activeAccount, accounts, handleOnClick, accountId }) {
    if (activeAccount) {
        return (
            <Container open={open}>
                <div className='wrapper'>
                    <div className='selected'>
                        <Account account={activeAccount} onClick={handleOnClick} mainAccountId={accountId}/>
                        {accounts.length > 1 && <ChevronIcon color='#0072CE'/>}
                    </div>
                    {open &&
                        <div className='accounts'>
                            {accounts.filter(({ accountId }) => activeAccount.accountId !== accountId).map((account, i) => 
                                <Account 
                                    account={account}
                                    key={i}
                                    onClick={handleOnClick}
                                    mainAccountId={accountId}
                                />
                            )}
                        </div>
                    }
                </div>
            </Container>
        )
    } else {
        return null
    }
}