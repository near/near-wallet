import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
    &&& {
        display: flex;
        align-items: center;
    
        > button {
            flex: 1;

            :last-of-type {
                margin-left: 20px;
            }
        }
    }
`;

export default ({
    children
}) => {
    return (
        <StyledContainer className='button-group'>
            {children}
        </StyledContainer>
    );
};