import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import GlobeIcon from '../../../images/globe-icon.svg';

const StyledContainer = styled.div`
    border: 1px solid #D6EDFF;
    background-color: #F0F9FF;
    color: #005497;
    padding: 6px 12px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;

    > img {
        margin-right: 10px;
    }
`;

export default ({ appReferrer }) => (
    <StyledContainer className='connect-with-application'>
        <img src={GlobeIcon} alt='globe-icon' />
        {appReferrer || <Translate id='sign.unknownApp' />}
    </StyledContainer>
);