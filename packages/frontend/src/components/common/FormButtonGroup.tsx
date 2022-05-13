import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
    &&& {
        display: flex;
        align-items: center;
    
        > button {
            flex: 1;

            :last-of-type:not(:first-of-type) {
                margin-left: 20px;
            }
        }
    }
`;

type FormButtonGroupProps = {
    children: ReactNode | ReactNode[];
}

export default ({
    children
}:FormButtonGroupProps) => {
    return (
        <StyledContainer className='button-group'>
            {children}
        </StyledContainer>
    );
};
