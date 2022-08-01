import React from 'react';
import styled from 'styled-components';

import GlobeIcon from '../../svg/GlobeIcon';

const StyledContainer = styled.div`
    border: 1px solid #a47fcf; // TODO: use color based on metadata
    background-color: #f9f1fd; // TODO: use color based on metadata
    color: #a47fcf; // TODO: use color based on metadata
    padding: 6px 12px;
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    /* cursor: pointer; */

    > svg {
        margin-right: 10px;
    }
`;

export default ({ customRPCUrl }) => (
    // TODO: should it be link or not?
    <StyledContainer className='connect-with-application'>
        <GlobeIcon/> {/* TODO: get logo from metadata? */}
        {customRPCUrl}
    </StyledContainer>
);
