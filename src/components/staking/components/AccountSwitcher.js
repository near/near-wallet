import React from 'react'
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
        z-index: 1;
        box-shadow: 0px 2px 2px 0px rgb(17 22 24 / 4%);
        cursor: ${props => props.multipleAccounts ? 'pointer' : 'default'};
    }

    .selected {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .account {
            width: 100%;
            margin-right: -33px;
            
            :hover {
                background-color: ${props => !props.open && props.multipleAccounts ? '#F8F8F8' : 'white'};
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
            background-color: #F0F9FF;
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
                    margin-bottom: 5px;
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
                {isLockup ? <LockIcon color='#0072CE'/> : <WalletIcon color='#0072CE'/>}
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
    const multipleAccounts = accounts.length > 1
    if (activeAccount) {
        return (
            <Container open={open} multipleAccounts={multipleAccounts}>
                <div className='wrapper'>
                    <div className='selected'>
                        <Account account={activeAccount} onClick={handleOnClick} mainAccountId={accountId}/>
                        {multipleAccounts && <ChevronIcon color='#0072CE'/>}
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