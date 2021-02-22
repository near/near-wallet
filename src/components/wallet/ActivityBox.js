import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import SendIcon from '../svg/SendIcon'
import KeyIcon from '../svg/KeyIcon'
import DownArrowIcon from '../svg/DownArrowIcon'

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 0;

    :hover {
        cursor: pointer;
    }

    .symbol {
        width: 40px;
        height: 40px;
        border: 1px solid #F0F0F1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;

        svg {
            height: 22px;
            width: 22px;
        }
    }

    .desc {
        div {
            :first-of-type {
                font-weight: 700;
                color: #24272a;
            }

            :last-of-type {
                span {
                    :first-of-type {
                        color: #A2A2A8;
                        margin-right: 4px;
                    }
                    :last-of-type {
                        color: #72727A;
                    }
                }
            }
        }
    }

    .right {
        margin-left: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .value {
            font-weight: 700;
            color: #24272a;
        }
        .time {
            color: #A2A2A8;
        }
    }

    .send-icon {
        path {
            stroke: #0072CE;
        }
    }
    
    .down-arrow-icon {
        path {
            stroke: #00C08B;
        }
    }

`

const ActivityBox = ({ transaction }) => {
    return (
        <StyledContainer className='activity-box'>
            <div className='symbol'>
                {/* For delete/red key: <KeyIcon color='#ff585d'/>*/}
                <KeyIcon/>
            </div>
            <div className='desc'>
                <div>Access Key added</div>
                <div>
                    <span>for</span>
                    <span>janedoe.near</span>
                </div>
            </div>
            <div className='right'>
                <span className='value'>
                    -10.123 NEAR
                </span>
                <span className='time'>4d</span>
            </div>
        </StyledContainer>
    )
}

export const ActionStatus = ({ status }) => (
    <span className={classNames(['status', {'dots': !status}])}>
        {status && <StyledDot background={TX_STATUS_COLOR[status]} />}
        <Translate id={`transaction.status.${status || 'checkingStatus'}`} />
    </span>
)

export default ActivityBox
