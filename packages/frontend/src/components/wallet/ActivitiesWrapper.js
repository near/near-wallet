import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { selectAccountId } from '../../reducers/account';
import { selectOneTransactionByIdentity, selectTransactionsByAccountId, selectTransactionsLoading } from '../../redux/slices/transactions';
import { actions as transactionsActions } from '../../redux/slices/transactions';
import classNames from '../../utils/classNames';
import { EXPLORER_URL } from '../../utils/wallet';
import FormButton from '../common/FormButton';
import ActivityBox from './ActivityBox';
import ActivityDetailModal from './ActivityDetailModal';

const StyledContainer = styled.div`
    width: 100%;

    @media (min-width: 992px) {
        border: 2px solid #F0F0F0;
        border-radius: 8px;
        padding: 20px;

        h2 {
            margin-bottom: 15px !important;
        }

        .activity-box {
            margin: 0 -20px;
            padding: 15px 20px;
            transition: 100ms;

            :hover {
                background-color: #f9f9f9;
            }

            :first-of-type {
                border-top: 1px solid #F0F0F1;
            }
        }
    }

    .activity-box {
        border-bottom: 1px solid #F0F0F1;

        :last-of-type {
            border-bottom: 0;
        }
    }

    h2 {
        margin-top: 0 !important;
    }

    .dots {
        :after {
            position: absolute;
            content: '.';
            animation: link 1s steps(5, end) infinite;
        
            @keyframes link {
                0%, 20% {
                    color: rgba(0,0,0,0);
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                40% {
                    color: #24272a;
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                60% {
                    text-shadow:
                        .3em 0 0 #24272a,
                        .6em 0 0 rgba(0,0,0,0);
                }
                80%, 100% {
                    text-shadow:
                        .3em 0 0 #24272a,
                        .6em 0 0 #24272a;
                }
            }
        }
    }
`;

const ActivitiesWrapper = () => {
    const dispatch = useDispatch();

    const [transactionHash, setTransactionHash] = useState();

    const accountId = useSelector(state => selectAccountId(state));
    const transactions = useSelector(state => selectTransactionsByAccountId(state, { accountId }));
    const transaction = useSelector(state => selectOneTransactionByIdentity(state, { accountId, hash: transactionHash }));
    const activityLoader = useSelector(state => selectTransactionsLoading(state, { accountId }));

    useEffect(() => {
        if (accountId) {
            dispatch(transactionsActions.fetchTransactions({ accountId }));
        }
    }, [accountId]);

    return (
        <StyledContainer>
            <h2 className={classNames({'dots': activityLoader})}><Translate id='dashboard.activity' /></h2>
            {transactions.map((transaction, i) => (
                <ActivityBox
                    key={transaction.hash_with_index}
                    transaction={transaction}
                    actionArgs={transaction.args}
                    actionKind={transaction.kind}
                    receiverId={transaction.receiver_id}
                    accountId={accountId}
                    setTransactionHash={setTransactionHash}
                />
            ))}
            {transactionHash && 
                <ActivityDetailModal 
                    open={transactionHash}
                    onClose={() => setTransactionHash()}
                    accountId={accountId}
                    transaction={transaction}
                />
            }
            <FormButton
                color='gray-blue'
                linkTo={`${EXPLORER_URL}/accounts/${accountId}`}
                trackingId='Click to account on explorer'
            >
                <Translate id='button.viewAll'/>
            </FormButton>
        </StyledContainer>
    );
};

export default ActivitiesWrapper;
