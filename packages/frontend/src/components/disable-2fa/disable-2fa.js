import React from 'react';
import styled from 'styled-components';

// import Container from '../common/styled/Container.css';

const StyledContainer = styled.div`
  &&& {
    text-align: center;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export function Disable2faPage() {
    return (
        <StyledContainer>
            <h2>
                Page for disabling 2FA
            </h2>
        </StyledContainer>
    );
}
