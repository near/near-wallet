import React from 'react';
import styled from 'styled-components';
import Balance from '../common/Balance';

const StyledBalance = styled.div`
    color: #8FD6BD;
`

const UserBalance = ({ amount }) => (
    <StyledBalance className='user-balance'>
        {amount && <Balance amount={amount}/>}
    </StyledBalance>
)

export default UserBalance;