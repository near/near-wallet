import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ActivityBox from './ActivityBox'
import ActivityDetailModal from './ActivityDetailModal'

const StyledContainer = styled.div`
    width: 100%;

    .activity-box {
        border-bottom: 1px solid #F0F0F1;

        :last-of-type {
            border-bottom: 0;
        }
    }
`

const Activities = ({ transactions, accountId, getTransactionStatus }) => {
    const [showDetails, setShowDetails] = useState(false)
    const [transactionHash, setTransactionHash] = useState()
    
    const activityLoader = actionsPending('GET_TRANSACTIONS')
    console.log('activityLoader', activityLoader);

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
                        onClick={() => setShowDetails(true)}
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
