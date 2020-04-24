import React from 'react';
import styled from 'styled-components';
import Balance from '../common/Balance';
import { wallet } from '../../utils/wallet';

const StyledBalance = styled.div`
    color: #8FD6BD;
`

const UserBalance = ({ amount }) => (
    <StyledBalance className='user-balance'>
        {amount && <Balance amount={wallet.getAccountBalance()}/>}
    </StyledBalance>
)

export default UserBalance;