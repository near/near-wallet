import React, { useState } from 'react'
import styled from 'styled-components'
import classNames from '../../../utils/classNames'
import { Translate } from 'react-localize-redux'
import ChevronIcon from '../../svg/ChevronIcon'
import Balance from '../../common/Balance'
import { WALLET_APP_MIN_AMOUNT } from '../../../utils/wallet'
import * as nearApiJs from 'near-api-js'
import BN from 'bn.js'
import { Mixpanel } from '../../../mixpanel/index'
import Tooltip from '../../common/Tooltip'
import Accordion from '../../common/Accordion'

const Container = styled.div`
    font-size: 13px;

    &.error {
        .title {
            color: #ff585d !important;
        }
    }

    &.open {
        .chevron-icon {
            transform: rotate(-90deg) !important;
        }

        .title {
            color: #292526;
        }
    }

    .item {
        display: flex;
        align-items: center;
        padding: 18px 0;
        border-bottom: 1px solid #F5F5F3;

        :last-of-type {
            border-color: #E6E5E3;
        }

        .right {
            margin-left: auto;
        }
    }

    .title {
        padding: 15px 0;
        display: flex;

        div {
            :first-of-type {
                display: flex;
                align-items: center;
                cursor: pointer;

                .chevron-icon {
                    transform: rotate(90deg);
                    margin-left: 12px;
                    width: 8px;
                    height: 12px;
                    margin-top: 2px;
                }

            }
        }

        .right {
            margin-left: auto;
        }
    }

    .info-icon {
        margin-left: 8px;
        width: 16px;
        height: 16px;
        margin-bottom: -4px;
    }
`

function BalanceBreakdown({ total, onClickAvailable, availableType, error }) {
    const [open, setOpen] = useState(false)

    const subtractAmount = nearApiJs.utils.format.parseNearAmount(WALLET_APP_MIN_AMOUNT)
    const available = total
        ? new BN(total).sub(new BN(subtractAmount)).isNeg() ? '0' :  new BN(total).sub(new BN(subtractAmount))
        : undefined

    return (
        <Translate>
            {({ translate }) => (
                <Container className={classNames([open ? 'open' : '', error ? 'error' : ''])}>
                    <Accordion trigger='balance-breakdown-1'>
                        <div className='item'>
                            <Translate id='balanceBreakdown.available'/>
                            <div className='right'>
                                <Balance amount={total} symbol='near'/>
                            </div>
                        </div>
                        <div className='item'>
                            <Translate id='balanceBreakdown.reserved' />
                            <Tooltip translate='reservedForFeesInfo'/>
                            <div className='right'>
                                - <Balance amount={subtractAmount} symbol='near'/>
                            </div>
                        </div>
                    </Accordion>
                    <div className='title'>
                        <div id='balance-breakdown-1' onClick={() => {setOpen(!open); Mixpanel.track("Watch available to send")}}>
                            <Translate id={availableType}/><ChevronIcon color='#0072ce'/>
                        </div>
                        <div className='right' onClick={onClickAvailable}>
                            <Balance amount={available} symbol='near'/>
                        </div>
                    </div>
                </Container>
            )}
        </Translate>
    )
}

export default BalanceBreakdown