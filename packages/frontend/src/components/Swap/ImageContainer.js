import React from 'react';
import styled from 'styled-components';

import SuccessSwap from '../../images/SuccessSwap.png';

const StyledImageContainer = styled.div`
    width: 113px;
    height: 98px;
    margin: 0 auto;
    margin-bottom: 12px;
    > img {
        width: 113px;
        height: 98px;
    }
`;

const ImageContainer = () => {
    return (
        <StyledImageContainer>
            <img src={SuccessSwap} alt="SuccessSwap" />
        </StyledImageContainer>
    );
};

export default ImageContainer;
