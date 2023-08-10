import React from 'react';
import styled from 'styled-components';

import GetYourTicket from './GetYourTickets';

const StyledContainer = styled.div`
    background-color: transparent;
    border-radius: 8px;
    padding-bottom: 30px;
    margin-bottom: 35px;
    height: 400px;
    
    color: #25272A;
`;

const StyledBanner = styled.div`
    height: 395px;
    margin-bottom: 10px;
`;

export default () => { 
    return (
        <StyledContainer>
            <StyledBanner>
                <GetYourTicket />
            </StyledBanner>
        </StyledContainer>
    );
};
