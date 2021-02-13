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

const Activities = ({ transactions }) => {
    const [showDetails, setShowDetails] = useState(false)
    return (
        <>
            <StyledContainer onClick={() => setShowDetails(true)}>
                {transactions.slice(0, 5).map((transaction, i) => (
                    <ActivityBox key={i} transaction={transaction}/>
                ))}
            </StyledContainer>
            {showDetails && 
                <ActivityDetailModal 
                    open={showDetails}
                    onClose={() => setShowDetails(!showDetails)}
                />
            }
        </>
    )
}

export default Activities