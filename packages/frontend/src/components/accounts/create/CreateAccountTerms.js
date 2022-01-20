import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

const StyledContainer = styled.div`
    color: #72727A;
    text-align: center;
    font-size: 12px;
    max-width: 350px;
    margin: 0 auto;

    a {
        color: #72727a;
        text-decoration: underline;
    }
`;

export default () => (
    <StyledContainer className='create-account-terms'>
        <Translate id='createAccount.termsPage.disclaimer' />
    </StyledContainer>
);