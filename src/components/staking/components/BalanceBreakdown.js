import React, { useState } from 'react'
import styled from 'styled-components'
import classNames from '../../../utils/classNames'
import { Translate } from 'react-localize-redux'
import { Modal } from 'semantic-ui-react'
import InfoIcon from '../../svg/InfoIcon.js'
import ChevronIcon from '../../svg/ChevronIcon'
import InfoPopup from '../../common/InfoPopup'

const Container = styled.div`

    .content {
        height: 0px;
        overflow: hidden;
        transition: 300ms;
        opacity: 0;
    }

    &.open {
        .content {
            opacity: 1;
            height: 112px;
        }

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
        padding: 18px 0;
        display: flex;

        div {
            :first-of-type {
                display: flex;
                align-items: center;
                padding-right: 10px;
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
`

function BalanceBreakdown({ balance }) {
    const [open, setOpen] = useState(false)
    return (
        <Translate>
            {({ translate }) => (
                <Container className={classNames([open ? 'open' : ''])}>
                    <div className='content'>
                        <div className='item'>
                            Available Balance
                            <InfoPopup content={<Translate id='availableBalanceInfo'/>}/>
                            <div className='right'>30234324234 NEAR</div>
                        </div>
                        <div className='item'>
                            Reserved for fees
                            <InfoPopup content={<Translate id='availableBalanceInfo'/>}/>
                            <div className='right'>- 0.1 NEAR</div>
                        </div>
                    </div>
                    <div className='title'>
                        <div onClick={() => setOpen(!open)}>Available to Stake <ChevronIcon color='#0072ce'/></div>
                        <div className='right'>
                            234234234 NEAR
                        </div>
                    </div>
                </Container>
            )}
        </Translate>
    )
}

export default BalanceBreakdown