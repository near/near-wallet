import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
    &&& {
        margin: 25px -25px -25px -25px;
        padding: 25px;
        border-top: 1px solid #F0F0F1;

        > button {
            margin: 0;
        }   
    }
`;

type ModalFooterProps = {children: ReactNode}

export default ({ children }:ModalFooterProps) => (
    <StyledContainer className='modal-footer'>
        {children}
    </StyledContainer>
);
