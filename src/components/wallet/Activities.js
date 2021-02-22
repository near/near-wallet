import React, { useState } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'

import ActivityBox from './ActivityBox'
import ActivityDetailModal from './ActivityDetailModal'
import FormButton from '../common/FormButton'
import { EXPLORER_URL } from '../../utils/wallet'
import { actionsPending } from '../../utils/alerts'
import classNames from '../../utils/classNames'

const StyledContainer = styled.div`
    width: 100%;

    .activity-box {
        border-bottom: 1px solid #F0F0F1;

        :last-of-type {
            border-bottom: 0;
        }
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
`

const Activities = ({ transactions, accountId, getTransactionStatus }) => {
    const [transactionHash, setTransactionHash] = useState()
    const activityLoader = actionsPending('GET_TRANSACTIONS')

    return (
        <StyledContainer>
            <h2 className={classNames({'dots': activityLoader})}><Translate id='dashboard.activity' /></h2>
            {transactions
                ? transactions.map((transaction, i) => (
                    <ActivityBox
                        key={i}
                        transaction={transaction}
                        actionArgs={transaction.args}
                        actionKind={transaction.kind}
                        accountId={accountId}
                        getTransactionStatus={getTransactionStatus}
                        setTransactionHash={setTransactionHash}
                    />
                ))
                : 'loader' // skeleton?
            }
            {transactionHash && 
                <ActivityDetailModal 
                    open={transactionHash}
                    onClose={() => setTransactionHash()}
                    accountId={accountId}
                    transaction={transactions.find((transaction) => transaction.hash === transactionHash)}
                    getTransactionStatus={getTransactionStatus}
                />
            }
            <FormButton
                color='gray-blue'
                linkTo={`${EXPLORER_URL}/accounts/${accountId}`}
            >
                <Translate id='button.viewAll'/>
            </FormButton>
        </StyledContainer>
    )
}

export default Activities
