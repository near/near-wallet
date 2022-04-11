import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

const StyledContainer = styled.div`
    color: #A2A2A8;
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    > div {
        margin-right: 15px;
        width: 32px;
        min-width: 32px;
        height: 32px;
        background-color: #F0F0F1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 16px;
            height: 16px;
        }
    }
    
    &.permitted {
        color: #272729;
        > div {
            background-color: #D6EDFF;
        }
    }
`;

const Check = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#0072CE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const X = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 12" stroke="#A2A2A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 4L12 12" stroke="#A2A2A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ({
    permitted = true,
    translateId
}) => (
    <StyledContainer className={permitted ? 'permitted' : ''}>
        <div>
            {permitted ? <Check /> : <X/>}
        </div>
        <Translate id={translateId} />
    </StyledContainer>
);
