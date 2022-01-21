import React from 'react';
import styled from 'styled-components';

import ArrowIcon from '../svg/ArrowIcon';

const StyledContainer = styled.div`
    &&& {
        appearance: none;
        transition: 100ms;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;

        :hover {
            background-color: #eeefee;

            svg {
                min-width: 24px;
                min-height: 24px;
                path {
                    stroke: #0072CE;
                }
            }
        }
    }
`;

const BackArrowButton = ({ onClick, color = 'black' }) => {
    return (
        <StyledContainer onClick={onClick} className='back-arrow-button' type='button'>
            <ArrowIcon color={color}/>
        </StyledContainer>
    );
};

export default BackArrowButton;