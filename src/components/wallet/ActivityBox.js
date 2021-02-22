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

const StyledDot = styled.span`
    height: 7px;
    width: 7px;
    border-radius: 50%;
    background-color: ${(props) => props.background};
    margin-right: 5px;
`

const ActivityBox = ({ transaction, actionArgs, actionKind, accountId, getTransactionStatus, onClick, setTransactionHash }) => {
    const { checkStatus, status, hash, signer_id, block_timestamp } = transaction

    return (
        <StyledContainer className='activity-box' onClick={() => setTransactionHash(hash)}>
            <ActionIcon actionKind={actionKind} />
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
                <ActionValue
                    transaction={transaction}
                    actionArgs={actionArgs}
                    actionKind={actionKind}
                    accountId={accountId}
                />
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

const translateData = (transaction, actionArgs, actionKind) => ({
    receiverId: transaction.receiver_id || '',
    signerId: transaction.signer_id || '',
    methodName: actionKind === "FunctionCall" ? actionArgs.method_name : '', 
    deposit: actionKind === "Transfer" ? <Balance amount={actionArgs.deposit} /> : '',
    stake: actionKind === "Stake" ? <Balance amount={actionArgs.stake} />  : '',
    permissionReceiverId: (actionKind === "AddKey" && actionArgs.access_key && actionArgs.access_key.permission.permission_kind === 'FUNCTION_CALL') ? actionArgs.access_key.permission.permission_details.receiver_id : ''
})

const ActionIcon = ({ actionKind }) => (
    <div className='symbol'>
        {actionKind === 'CreateAccount' && <IconTAcct />}
        {actionKind === 'DeleteAccount' && <IconTKeyDelete />}
        {actionKind === 'DeployContract' && <IconTContract />}
        {actionKind === 'FunctionCall' && <IconTCall />}
        {actionKind === 'Transfer' && <IconTTransfer />}
        {actionKind === 'Stake' && <IconTStake />}
        {actionKind === 'AddKey' && <IconTKeyNew />}
        {actionKind === 'DeleteKey' && <IconTKeyDelete />}
    </div>
)

const ActionTimeStamp = ({ timeStamp }) => (
    <span className='time'>
        {format(timeStamp, {locale: 'en_short'})}
    </span>
)

export const ActionValue = ({ transaction, actionArgs, actionKind, accountId }) => (
    <div className={`value ${actionKind === 'Transfer' ? transaction.signer_id === accountId ? 'transferred' : 'received' : ''}`}>
        {actionKind === "Transfer" && <Balance amount={actionArgs.deposit} symbol='near' />}
        {actionKind === "Stake" && <Balance amount={actionArgs.stake} symbol='near' />}
    </div>
)

export const TX_STATUS_COLOR = {
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
