<<<<<<< HEAD
import React from "react";
import styled from "styled-components";
import SuccessSwap from "../../images/SuccessSwap.png";
=======
import React from 'react';
import styled from 'styled-components';

import SuccessSwap from '../../images/SuccessSwap.png';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

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
