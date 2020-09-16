import React from 'react';
import styled from 'styled-components';

const StyledUserName = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
`

const UserName = ({ accountId }) => (
    <StyledUserName className='user-name'>
        {accountId && `${accountId}`}
    </StyledUserName>
)

export default UserName;