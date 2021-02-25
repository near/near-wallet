import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import { format } from 'timeago.js'

import Balance from '../common/Balance'
import IconTStake from '../../images/IconTStake'
import classNames from '../../utils/classNames'

import KeyIcon from '../svg/KeyIcon'
import DownArrowIcon from '../svg/DownArrowIcon'
import SendIcon from '../svg/SendIcon'
import CodeIcon from '../svg/CodeIcon'
import UserIcon from '../svg/UserIcon'


const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 0;

    @media (max-width: 991px) {
        margin: 0 -14px;
        padding: 15px 14px;
    }

    :hover {
        cursor: pointer;
    }

    .symbol {
        min-width: 40px;
        min-height: 40px;
        width: 40px;
        height: 40px;
        border: 1px solid #F0F0F1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;
    }

    .desc {
        > div {
            font-weight: 700;
            color: #24272a;
        }
        > span {
            color: #A2A2A8;
            max-width: 300px;
            overflow: hidden;
            display: block;
            text-overflow: ellipsis;
            white-space: nowrap;

            @media (max-width: 500px) {
                max-width: 190px;
            }

            @media (max-width: 355px) {
                max-width: 140px;
            }

            > span {
                color: #3F4045;
                
                :first-of-type {
                    color: #A2A2A8;
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
            height: 20px;

            &.transferred {
                &::before {
                    content: '-'
                }
            }
            &.received {
                color: #00C08B;

                &::before {
                    content: '+'
                }
            }
        }
        .time {
            color: #A2A2A8;
            text-align: right;
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

const StyledDot = styled.span`
    height: 7px;
    width: 7px;
    border-radius: 50%;
    background-color: ${(props) => props.background};
    margin-right: 5px;
`

const ActivityBox = ({ transaction, actionArgs, actionKind, accountId, setTransactionHash, receiverId }) => {
    const { hash, block_timestamp, kind } = transaction

    return (
        <StyledContainer className='activity-box' onClick={() => setTransactionHash(`${hash}-${kind}`)}>
            <ActionIcon actionKind={actionKind} receiverId={receiverId} accountId={accountId}/>
            <div className='desc'>
                <ActionTitle 
                    transaction={transaction}
                    actionArgs={actionArgs}
                    actionKind={actionKind}
                    accountId={accountId}
                />
                <ActionMessage 
                    transaction={transaction}
                    actionArgs={actionArgs}
                    actionKind={actionKind}
                    accountId={accountId}
                />
            </div>
            <div className='right'>
                {['Transfer', 'Stake'].includes(actionKind) &&
                    <ActionValue
                        transaction={transaction}
                        actionArgs={actionArgs}
                        actionKind={actionKind}
                        accountId={accountId}
                    />
                }
                <ActionTimeStamp
                    timeStamp={block_timestamp}
                />
            </div>
        </StyledContainer>
    )
}

export const ActionTitle = ({ transaction, actionArgs, actionKind, accountId }) => (
    <div>
        <Translate 
            id={`dashboardActivity.title.${translateId(transaction, actionArgs, actionKind, accountId)}`}
        />
    </div>
)

export const ActionMessage = ({ transaction, actionArgs, actionKind, accountId }) => (
    <Translate 
        id={`dashboardActivity.message.${translateId(transaction, actionArgs, actionKind, accountId)}`}
        data={translateData(transaction, actionArgs, actionKind)}
    />
)

const translateId = (transaction, actionArgs, actionKind, accountId) => (
    `${actionKind
        }${actionKind === `AddKey`
            ? actionArgs.access_key && actionArgs.access_key.permission.permission_details
                ? `.forContract`
                : `.forReceiver`
            : ''
        }${actionKind === 'Transfer'
            ? transaction.signer_id === accountId
                ? '.transferred'
                : '.received'
            : ''
    }`
)

export const translateData = (transaction, actionArgs, actionKind) => ({
    receiverId: transaction.receiver_id || '',
    signerId: transaction.signer_id || '',
    methodName: actionKind === "FunctionCall" ? actionArgs.method_name : '', 
    deposit: actionKind === "Transfer" ? <Balance amount={actionArgs.deposit} /> : '',
    stake: actionKind === "Stake" ? <Balance amount={actionArgs.stake} />  : '',
    permissionReceiverId: (actionKind === "AddKey" && actionArgs.access_key && actionArgs.access_key.permission.permission_kind === 'FUNCTION_CALL') ? actionArgs.access_key.permission.permission_details.receiver_id : ''
})

const ActionIcon = ({ actionKind, receiverId, accountId }) => (
    <div className='symbol'>
        {actionKind === 'CreateAccount' && <UserIcon color='#0072CE' />}
        {actionKind === 'DeleteAccount' && <UserIcon color='#ff585d'/>}
        {actionKind === 'DeployContract' && <CodeIcon />}
        {actionKind === 'FunctionCall' && <CodeIcon />}
        {actionKind === 'Transfer' && (receiverId === accountId ? <DownArrowIcon /> : <SendIcon/>)}
        {actionKind === 'Stake' && <IconTStake />}
        {actionKind === 'AddKey' && <KeyIcon />}
        {actionKind === 'DeleteKey' && <KeyIcon color='#ff585d' />}
    </div>
)

const ActionTimeStamp = ({ timeStamp }) => {
    let time = format(timeStamp)
    let formatting = {
        'ago': '',
        'months': 'm',
        'month': 'm',
        'weeks': 'w',
        'week': 'w',
        'days': 'd',
        'day': 'd',
        'hours': 'h',
        'hour': 'h',
        'minutes': 'm',
        'minute': 'm',
        'seconds': 's'
    }

    for (const format in formatting) {
        time = time.replace(`${format}`, `${formatting[format]}`)
    }

    return (
        <span className='time'>
            {time}
        </span>
    )
}

export const ActionValue = ({ transaction, actionArgs, actionKind, accountId }) => (
    <div className={`value ${actionKind === 'Transfer' ? transaction.signer_id === accountId ? 'transferred' : 'received' : ''}`}>
        {actionKind === "Transfer" && <Balance amount={actionArgs.deposit} symbol='near' />}
        {actionKind === "Stake" && <Balance amount={actionArgs.stake} symbol='near' />}
    </div>
)

const TX_STATUS_COLOR = {
    NotStarted: '',
    Started: '#6ad1e3',
    Failure: '#ff585d',
    SuccessValue: '#5ace84',
    notAvailable: '#ff585d'
}

export const ActionStatus = ({ status }) => (
    <span className={classNames(['status', {'dots': !status}])}>
        {status && <StyledDot background={TX_STATUS_COLOR[status]} />}
        <Translate id={`transaction.status.${status || 'checkingStatus'}`} />
    </span>
)

export default ActivityBox
