import React from 'react';
import { Translate } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
<<<<<<< HEAD
=======

>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
import SwapIconTwoArrows from '../svg/SwapIconTwoArrows';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    min-width: 85px;
    cursor: pointer;
    svg {
        margin-top: 4px;
    }
    .swap {
        display: flex;
        white-space: nowrap;
        margin-left: 10px;
        font-size: 14px;
        font-weight: 600;
        color:${({disable}) => (!disable ? '#24272a' : '#b7b7b7')};
    }
`;

const Swap = ({ disable, onClick, linkTo , history, symbol}) => {
    return (
        <>
        <StyledContainer 
            disable={disable} 
            onClick={(e) => {
                onClick && !disable && onClick(e);
                linkTo && history.push(linkTo);
                
            }}>
                <SwapIconTwoArrows color={!disable ? '#000' : '#b7b7b7'}/>
                <div className='swap'>
<<<<<<< HEAD
                    <div><Translate id='tokenBox.swapTo'/> {!symbol ? `NEAR` : 'USN'}</div>
=======
                    <div><Translate id='tokenBox.swapTo'/> {!symbol ? 'NEAR' : 'USN'}</div>
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                </div>
        </StyledContainer>
        </>
    );
};

export default withRouter(Swap);
