import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';
import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { Mixpanel } from '../../../mixpanel/index';
import classNames from '../../../utils/classNames';
import { WALLET_APP_MIN_AMOUNT } from '../../../utils/wallet';
import Accordion from '../../common/Accordion';
import Balance from '../../common/balance/Balance';
import Tooltip from '../../common/Tooltip';
import ChevronIcon from '../../svg/ChevronIcon';

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
            text-align: right;
        }
    }

    .title {
        padding: 15px 0;
        display: flex;
        align-items: flex-start;
        align-items: center;
        
        > div {
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
            text-align: right;
        }
    }

    .info-icon {
        margin-left: 8px;
        width: 16px;
        height: 16px;
        margin-bottom: -4px;
    }
`;

function BalanceBreakdown({ total, onClickAvailable, availableType, error, transfer }) {
    const [open, setOpen] = useState(false);

    const subtractAmount = nearApiJs.utils.format.parseNearAmount(WALLET_APP_MIN_AMOUNT);
    const available = total
        ? new BN(total).sub(new BN(subtractAmount)).isNeg() ? '0' :  new BN(total).sub(new BN(subtractAmount))
        : undefined;

    return (
        <Translate>
            {({ translate }) => (
                <Container className={classNames(['balance-breakdown' , open ? 'open' : '', error ? 'error' : ''])}>
                    <Accordion trigger='balance-breakdown-1'>
                        <div className='item'>
                            <Translate id='balanceBreakdown.available'/>
                            <div className='right'>
                                <Balance amount={total}/>
                            </div>
                        </div>
                        <div className='item'>
                            <Translate id='balanceBreakdown.reserved' />
                            <Tooltip translate='reservedForFeesInfo'/>
                            <div className='right'>
                                <Balance amount={subtractAmount} showAmountAsSubtracted={true}/>
                            </div>
                        </div>
                    </Accordion>
                    <div 
                        className='title'
                        id={transfer ? 'balance-breakdown-1' : ''}
                        onClick={() => transfer ? setOpen(!open) : null}
                    >
                        <div id='balance-breakdown-1' onClick={() => {setOpen(!open); Mixpanel.track("Watch available to send");}}>
                            <Translate id={availableType}/><ChevronIcon color='#0072ce'/>
                        </div>
                        <div className='right' onClick={onClickAvailable}>
                            <Balance amount={available}/>
                        </div>
                    </div>
                </Container>
            )}
        </Translate>
    );
}

export default BalanceBreakdown;