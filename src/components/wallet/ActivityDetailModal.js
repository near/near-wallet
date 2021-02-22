import React from 'react'
import Modal from "../common/modal/Modal"
import FormButton from '../common/FormButton'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        text-align: center;
        margin-top: 20px;
    }

    .row {
        width: 100%;
        max-width: 400px;
        margin: 40px auto;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;

        border-top: 1px solid #F0F0F1;
        :last-of-type {
            border-bottom: 1px solid #F0F0F1;
        }

        span {
            :first-of-type {
                color: #A2A2A8;
            }
        }

        .amount {
            font-weight: 600;
        }

        .status {
            display: flex;
            align-items: center;
            span {
                height: 7px;
                width: 7px;
                border-radius: 50%;
                background-color: #4DD5A6;
                margin-right: 5px;
            }
        }
    }

    button {
        &.gray-blue {
            width: 100% !important;
            max-width: 400px;
        }
    }
`

const ActivityDetailModal = ({ 
    open,
    onClose,
    accountId,
    transaction,
    getTransactionStatus
}) => {
    const { 
        args: actionArgs,
        kind: actionKind,
        status,
        checkStatus,
        hash,
        signer_id,
        block_timestamp
    } = transaction

    const dispatch = useDispatch()
    const getTransactionStatusConditions = () => checkStatus && !document.hidden && dispatch(getTransactionStatus(hash, signer_id, accountId))

    useEffect(() => {
        getTransactionStatusConditions()
        const interval = setInterval(() => {
            getTransactionStatusConditions()
        }, TRANSACTIONS_REFRESH_INTERVAL)

        return () => clearInterval(interval)
    }, [hash, checkStatus])

    return (
        <Modal
            id='instructions-modal'
            isOpen={open}
            onClose={onClose}
            closeButton
        >
            <StyledContainer>
                <h2>
                    <ActionTitle 
                        transaction={transaction}
                        actionArgs={actionArgs}
                        actionKind={actionKind}
                        accountId={accountId}
                    />
                </h2>
                <div className='row'>
                    {actionKind !== 'DeleteKey' && 
                        <div className='item'>
                            <span>
                                <ActionMessage 
                                    transaction={transaction}
                                    actionArgs={actionArgs}
                                    actionKind={actionKind}
                                    accountId={accountId}
                                />
                            </span>
                            {['Transfer', 'Stake'].includes(actionKind) &&
                                <span className='amount'>
                                    <ActionValue
                                        transaction={transaction}
                                        actionArgs={actionArgs}
                                        actionKind={actionKind}
                                        accountId={accountId}
                                    />
                                </span>
                            }
                        </div>
                    }
                    <div className='item'>
                        <span>Date & time</span>
                        <span>{new Date(block_timestamp).toLocaleString()}</span>
                    </div>
                    <div className='item'>
                        <span>Status</span>
                        <ActionStatus 
                            status={status} 
                        />
                    </div>
                </div>
                <FormButton 
                    color='gray-blue' 
                    linkTo={`${EXPLORER_URL}/transactions/${hash}`}
                >
                    <Translate id='button.viewOnExplorer'/>
                </FormButton>
            </StyledContainer>
        </Modal>
    )
}

export default ActivityDetailModal
