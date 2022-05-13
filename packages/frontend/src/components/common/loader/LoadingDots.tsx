import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
    text-align: center;
    span {
        display: inline-block;
        vertical-align: middle;
        width: 5px;
        height: 5px;
        margin: 4px;
        background-color: #F0F0F1;
        border-radius: 50%;
        animation: loading 0.8s infinite alternate;

        :nth-of-type(1) {
            animation-delay: 0.2s;
        }
        :nth-of-type(2) {
            animation-delay: 0.4s;
        }
        :nth-of-type(3) {
            animation-delay: 0.6s;
        }
        :nth-of-type(4) {
            animation-delay: 0.8s;
        }
    }

    @keyframes loading {
        0% {
            background-color: #8FCDFF;
        }
        100% {
            background-color: #F0F0F1;
        }
    }
`;

export default () => (
    <StyledContainer className='loading-dots'>
        <div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </StyledContainer>
);
