import React, { useEffect } from 'react'
import { Translate } from 'react-localize-redux'
import { format } from 'timeago.js'
import Balance from '../common/Balance'
import IconTAcct from '../../images/IconTAcct'
import IconTKeyDelete from '../../images/IconTKeyDelete'
import IconTContract from '../../images/IconTContract'
import IconTCall from '../../images/IconTCall'
import IconTTransfer from '../../images/IconTTransfer'
import IconTStake from '../../images/IconTStake'
import IconTKeyNew from '../../images/IconTKeyNew'
import ArrowRight from '../../images/icon-arrow-right.svg'
import ArrowBlkImage from '../../images/icon-arrow-blk.svg'
import { Grid, Image } from 'semantic-ui-react'
import styled from 'styled-components'
import classNames from '../../utils/classNames'

import { TRANSACTIONS_REFRESH_INTERVAL } from '../../utils/wallet'

const CustomGridRow = styled(Grid.Row)`
    &&& {
        margin-left: 20px;
        border-left: 4px solid #f8f8f8;

        .list {
            margin-left: 0 !important;
        }

        .col-image {
            margin-left: -15px;
            width: 40px;
            flex: 0 0 40px;
            padding-left: 0px;

            > div {
                border: 1px solid #e6e6e6;
                background: #fff;
                border-radius: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                width: 26px;
                height: 26px;

                svg {
                    width: 12px;
                    height: 12px;
                }
            }
        }
        &.wide {
            margin-left: 0px;
            border-left: 0px;
        }
        .main-row-title {
            font-weight: 500;
            width: auto;
            padding: 8px 0;
            flex: 1;
            word-break: break-all;
            display: flex;
            align-items: center;
            flex-direction: row !important;
            justify-content: space-between;

            div {
                text-align: right;
                margin-left: 10px;
                white-space: nowrap;
            }
        }

        .dropdown-image-right {
            width: 10px;
            margin: 0;
        }
        .dropdown-image {
            float: right;
        }

        &.dropdown-down {
            background-color: #f8f8f8;

            .dropdown-image-right {
                width: 10px;
                top: 0px;
                left: 12px;
            }
        }

        &.showsub {
            .dropdown-image-right {
                left: -24px;
            }
        }
        &.showsub.dropdown-down {
            .dropdown-image-right {
                left: -6px;
            }
        }

        @media screen and (max-width: 767px) {
            &.showsub {
                .dropdown-image-right {
                    left: -14px;
                }
            }
            &.showsub.dropdown-down {
                .dropdown-image-right {
                    left: 4px;
                }
            }

            .main-row-title {
                a {
                    font-size: 14px;
                }
            }
        }
    }
`

const ActionsList = ({ transaction, wide, accountId, getTransactionStatus }) => (
    <ActionRow 
        transaction={transaction} 
        actionArgs={JSON.parse(transaction.args)} 
        actionKind={transaction.kind}  
        wide={wide}
        accountId={accountId}
        getTransactionStatus={getTransactionStatus}
    />
)

const ActionRow = ({ transaction, actionArgs, actionKind, wide, showSub = false, accountId, getTransactionStatus }) => {
    const { checkStatus, status, hash, signer_id, block_timestamp } = transaction
    const getTransactionStatusConditions = () => checkStatus && !document.hidden && getTransactionStatus(hash, signer_id, accountId)

    useEffect(() => {
        getTransactionStatusConditions()
        const interval = setInterval(() => {
            getTransactionStatusConditions()
        }, TRANSACTIONS_REFRESH_INTERVAL)

        return () => clearInterval(interval)
    }, [hash, checkStatus])

    return (
        <CustomGridRow
            verticalAlign='middle'
            className={`${wide ? `wide` : ``} ${
                showSub ? `dropdown-down` : ``
            } ${showSub ? `showsub` : ``}`}
            onClick={() => wide}
        >
            <Grid.Column
                computer={wide ? 15 : 16}
                tablet={wide ? 14 : 16}
                mobile={wide ? 14 : 16}
            >
                <Grid verticalAlign='middle'>
                    <Grid.Column className='col-image'>
                        <ActionIcon actionKind={actionKind} />
                    </Grid.Column>
                    <Grid.Column className='main-row-title color-black border-bottom'>
                        <ActionMessage 
                            transaction={transaction}
                            actionArgs={actionArgs}
                            actionKind={actionKind}
                            accountId={accountId}
                        />
                        <div>
                            <ActionTimeStamp
                                timeStamp={block_timestamp}
                            />
                            <ActionStatus 
                                status={status} 
                            />
                        </div>
                    </Grid.Column>
                </Grid>
            </Grid.Column>
            {wide && (
                <Grid.Column
                    computer={1}
                    tablet={2}
                    mobile={2}
                    textAlign='right'
                >
                    <Image
                        src={showSub ? ArrowBlkImage : ArrowRight}
                        className='dropdown-image dropdown-image-right'
                    />
                    {/* <span className='font-small'>{row[3]}</span> */}
                </Grid.Column>
            )}
        </CustomGridRow>
)}

const ActionMessage = ({ transaction, actionArgs, actionKind, accountId }) => (
    <Translate 
        id={translateId(transaction, actionArgs, actionKind, accountId)}
        data={translateData(transaction, actionArgs, actionKind)}
    />
)

const translateId = (transaction, actionArgs, actionKind, accountId) => (
    `actions.${actionKind
        }${actionKind === `AddKey`
            ? actionArgs.access_key && typeof actionArgs.access_key.permission === 'object'
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
    permissionReceiverId: (actionKind === "AddKey" && actionArgs.access_key && typeof actionArgs.access_key.permission === 'object') ? actionArgs.access_key.permission.FunctionCall.receiver_id : ''
})

const ActionIcon = ({ actionKind }) => (
    <div>
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
    <div className='font-small'>{format(timeStamp)}</div>
)

const TX_STATUS_COLOR = {
    NotStarted: '',
    Started: 'color-seafoam-blue',
    Failure: 'color-red',
    SuccessValue: 'color-green',
    notAvailable: 'color-red'
}

const ActionStatus = ({ status }) => (
    <div className={classNames(['font-small', {[TX_STATUS_COLOR[status]]: status, 'dots': !status}])}>
        <Translate id={`transaction.status.${status || 'checkingStatus'}`} />
    </div>
)

export default ActionsList
