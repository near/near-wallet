import React from 'react';
import styled from 'styled-components';
import Balance from '../common/Balance';


const StyledBalance = styled.div`
    color: #8FD6BD;

    .dots {
        color: inherit;
    }
`

const UserBalance = ({ balance }) => (
    <StyledBalance className='user-balance'>
        {balance && <Balance amount={balance.total}/>}
    </StyledBalance>
)

export default UserBalance;