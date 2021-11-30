import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import GlobeIcon from '../../svg/GlobeIcon';

const StyledContainer = styled.a`
    border: 1px solid #D6EDFF;
    background-color: #F0F9FF;
    color: #005497;
    padding: 6px 12px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    cursor: pointer;

    > svg {
        margin-right: 10px;
    }
`;

export default ({ appReferrer, contractIdUrl }) => (
    <StyledContainer className='connect-with-application' href={contractIdUrl} target='_blank' rel='noreferrer'>
        <GlobeIcon/>
        {appReferrer || <Translate id='sign.unknownApp' />}
    </StyledContainer>
);