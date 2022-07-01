import React, { useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { EXPLORER_URL } from '../../config';
import { actions as transactionsActions } from '../../redux/slices/transactions';
import { TRANSACTIONS_REFRESH_INTERVAL } from '../../utils/wallet';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import SafeTranslate from '../SafeTranslate';
import { ActionTitle, ActionValue, ActionMessage, ActionStatus, translateData } from './ActivityBox';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        &.title {
            text-align: center;
            margin-top: 20px;
            color: #24272a;
        }
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

        @media (max-width: 767px) {
            margin: 0 -25px;
            padding: 15px;
        }

        > span {
            :first-of-type {
                color: #A2A2A8;

                > span > span {
                    color: #3F4045;
                }
            }
        }
        &.sent-to > span {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > span {
                color: #3F4045;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;

                @media(max-width: 350px) {
                    max-width: 200px;
                }
                :first-of-type {
                    text-transform: capitalize;
                    color: #A2A2A8;
                }
            }
        }

        .amount {
            .value {
                font-weight: 700;
                color: #24272a;
                white-space: nowrap;
                display: flex;
                align-items: center;
                text-align: right;

                &.transferred {
                    .near-amount {
                        &::before {
                            content: '-'
                        }
                    }
                }
                &.received {
                    color: #00C08B;
                    .near-amount {
                        &::before {
                            content: '+'
                        }
                    }
                }
                .fiat-amount {
                    font-weight: 400;
                }
            }
        }
        .status {
            display: flex;
            align-items: center;
        }
    }

    button {
        &.gray-blue {
            width: 100% !important;
            max-width: 400px;
        }
    }
`;

const ActivityDetailModal = ({ 
    open,
    onClose,
    accountId,
    transaction
}) => {
    const { 
        args: actionArgs,
        kind: actionKind,
        status,
        checkStatus,
        hash,
        signer_id,
        block_timestamp,
        hash_with_index
    } = transaction;

    const dispatch = useDispatch();
    const getTransactionStatusConditions = () => checkStatus && !document.hidden && dispatch(transactionsActions.fetchTransactionStatus({ hash, signer_id, accountId, hash_with_index }));

    useEffect(() => {
        getTransactionStatusConditions();
        const interval = setInterval(() => {
            getTransactionStatusConditions();
        }, TRANSACTIONS_REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, [hash, checkStatus]);

    return (
        <Modal
            id='instructions-modal'
            isOpen={open}
            onClose={onClose}
            closeButton
        >
            <StyledContainer>
                <h2 className='title'>
                    <ActionTitle 
                        transaction={transaction}
                        actionArgs={actionArgs}
                        actionKind={actionKind}
                        accountId={accountId}
                    />
                </h2>
                <div className='row'>
                    {['Transfer', 'Stake'].includes(actionKind) && (
                        <div className='item'>
                            <span>
                                Amount
                            </span>
                            <span className='amount'>
                                <ActionValue
                                    transaction={transaction}
                                    actionArgs={actionArgs}
                                    actionKind={actionKind}
                                    accountId={accountId}
                                />
                            </span>
                        </div>
                    )}
                    {actionKind !== 'DeleteKey' &&  (
                        actionKind === 'FunctionCall'
                            ? (
                                <>
                                    <div className='item sent-to'>
                                        <SafeTranslate
                                            id={'dashboardActivity.message.FunctionCallDetails.first'}
                                            data={translateData(transaction, actionArgs, actionKind)}
                                        />
                                    </div>
                                    <div className='item sent-to'>
                                        <SafeTranslate
                                            id={'dashboardActivity.message.FunctionCallDetails.second'}
                                            data={translateData(transaction, actionArgs, actionKind)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className='item sent-to'>
                                    <ActionMessage 
                                        transaction={transaction}
                                        actionArgs={actionArgs}
                                        actionKind={actionKind}
                                        accountId={accountId}
                                    />
                                </div>
                            )
                    )
                    }
                    <div className='item'>
                        <span><Translate id='wallet.dateAndTime' /></span>
                        <span>{new Date(block_timestamp).toLocaleString('en-US', {dateStyle: 'short', timeStyle: 'short'})}</span>
                    </div>
                    <div className='item'>
                        <span><Translate id='wallet.status' /></span>
                        <ActionStatus 
                            status={status}
                        />
                    </div>
                </div>
                <FormButton 
                    color='gray-blue' 
                    linkTo={`${EXPLORER_URL}/transactions/${hash}`}
                    trackingId='Click access key added view on explorer button'
                >
                    <Translate id='button.viewOnExplorer'/>
                </FormButton>
            </StyledContainer>
        </Modal>
    );
};

export default ActivityDetailModal;
