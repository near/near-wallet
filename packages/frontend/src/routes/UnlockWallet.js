import React from 'react';
import styled from 'styled-components';

import Container from '../components/common/styled/Container.css';

const StyledContainer = styled(Container)`
    h4 {
        margin-top: 20px;
    }

    input {
        margin-bottom: 30px;
    }

    .color-red {
        margin-top: -20px;
    }
    
    &&& {
        button {
            width: 100%;
            margin-top: 20px;
            &.link {
                &.start-over {
                    margin: 30px auto 0 auto;
                    display: inherit;
                }
            }
        }
    }
`;

const UnlockWallet = () => {
  return (
    <StyledContainer>
        
        
    </StyledContainer>
  );
};

export default UnlockWallet;
