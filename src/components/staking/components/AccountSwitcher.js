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
    const accountId = account.accountId
    if (accountId) {
        return (
            <div className='account' onClick={() => onClick(accountId)}>
                <LockIcon/>
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

export default function AccountSwitcher({ open, activeAccount, accounts, handleOnClick }) {

    if (activeAccount) {
        return (
            <Container>
                <div className='wrapper'>
                    <div className='selected'>
                        <Account account={activeAccount} onClick={handleOnClick}/>
                        {activeAccount.accountId && <ChevronIcon color='#0072CE'/>}
                    </div>
                    {open &&
                        <div className='accounts'>
                            {accounts.map((account, i) => 
                                <Account 
                                    account={account}
                                    key={i}
                                    onClick={handleOnClick}
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