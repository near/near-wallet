import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import CopyIcon from '../../svg/CopyIcon'
import ClickToCopy from '../../common/ClickToCopy'
import Balance from '../../common/Balance'

const Container = styled.div`
    border-radius: 8px;
    color: #D5D4D8;
    font-size: 13px;
    background-color: #111618;

    > div {
        padding: 15px;

        &.status, &.amount {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .address {
        > div {
            :first-of-type {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            :last-of-type {
                color: white;
                background-color: #3F4045;
                border-radius: 8px;
                line-break: anywhere;
                padding: 15px;
                font-size: 14px;
                margin-top: 10px;
            }
        }
    }

    .status {
        border-top: 1px solid #d5d4d84f;
        border-bottom: 1px solid #d5d4d84f;
        span {
            border-radius: 40px;
            font-size: 11px;
            padding: 6px 14px;
            background-color: #FFDBB2;
            color: #995200;
        }
    }

    .amount {
        span {
            color: white;
            font-weight: 700;
            font-size: 14px;
        }
    }

    &.funded {
        .status {
            span {
                background-color: #90E9C5;
                color: #005A46;
            }
        }
    }

    .copy-funding-address {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #8FCDFF;

        svg {
            margin-right: 4px;
            width: 16px;

            path {
                stroke: #8FCDFF;
            }
        }
    }
`

const AccountFundedStatus = ({
    accountId,
    fundingAddress,
    minDeposit,
    intitalDeposit
}) => {

    return (
        <Container className={intitalDeposit ? 'funded' : ''}>
            <div className='address'>
                <div>
                    {!intitalDeposit ? 
                        <Translate id={`account.fundedStatus.${fundingAddress ? 'singleUse' : 'nearName'}`} /> 
                        : 
                        <Translate id='account.fundedStatus.nearName' />
                    }
                    {!intitalDeposit &&
                        <ClickToCopy
                            copy={accountId || fundingAddress}
                            className='copy-funding-address'
                        >
                            <CopyIcon/>
                            <Translate id='copy.title' />
                        </ClickToCopy>
                    }
                </div>
                <div>
                    {accountId || fundingAddress}
                </div>
            </div>
            <div className='status'>
                <Translate id='account.fundedStatus.status' />
                <span>
                    {!intitalDeposit ? 
                        <Translate id='account.fundedStatus.awaitingDeposit' />
                        :
                        <Translate id={`account.fundedStatus.${fundingAddress ? 'ready' : 'active'}`} /> 
                    }
                </span>
            </div>
            <div className='amount'>
                <Translate id={`account.fundedStatus.${!intitalDeposit ? 'minDeposit' : 'initialDeposit'}`} />
                <span>
                    <Balance
                        amount={!intitalDeposit ? minDeposit : intitalDeposit}
                        symbol='near'
                    />
                </span>
            </div>
        </Container>
    )
}

export default AccountFundedStatus