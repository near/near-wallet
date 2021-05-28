import React from 'react'
import styled from 'styled-components'
import QRCode from "qrcode.react";
import { Translate } from 'react-localize-redux'
import ClipboardIcon from '../../svg/ClipboardIcon'
import ClickToCopy from '../../common/ClickToCopy'
import Balance from '../../common/Balance'

const Container = styled.div`
    box-shadow: 0px 9px 24px 0px rgba(0,0,0,0.08);
    border-radius: 16px;
    color: #A2A2A8;
    font-size: 13px;

    > div {
        border-bottom: 1px solid #F0F0F1;
        padding: 15px;

        &.status, &.amount {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        :first-of-type, :last-of-type {
            border-bottom: 0;
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
                color: #272729;
                background-color: #F0F0F1;
                border-radius: 8px;
                line-break: anywhere;
                padding: 15px;
                font-size: 12px;
                margin-top: 10px;
            }
        }
    }

    .status {
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
            color: #272729;
            font-weight: 700;
            font-size: 14px;
        }
    }

    .qr-code {
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            margin: 30px;
            border: 1px solid #F0F0F1;
            padding: 20px;
            border-radius: 8px;
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
`

const AccountFundedStatus = ({
    accountId,
    fundingAddress,
    minDeposit,
    intitalDeposit
}) => {

    return (
        <Container className={intitalDeposit ? 'funded' : ''}>
            {!intitalDeposit &&
                <div className='qr-code'>
                    <QRCode
                        level="Q"
                        style={{ width: "50%", height: '50%' }}
                        renderAs='svg'
                        value={accountId || fundingAddress}
                    />
                </div>
            }
            <div className='address'>
                <div>
                    {!intitalDeposit ? 
                        <Translate id={`account.fundedStatus.${fundingAddress ? 'singleUse' : 'nearName'}`} /> 
                        : 
                        <Translate id='account.fundedStatus.nearName' />
                    }
                    {!intitalDeposit &&
                        <ClickToCopy copy={accountId || fundingAddress}>
                            <ClipboardIcon/>
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
                {!intitalDeposit ? 
                    <Translate id='account.fundedStatus.minDeposit' />
                    :
                    <Translate id='account.fundedStatus.initialDeposit' />
                    // FIX: NO NEED FOR TWO Translate tags
                }
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