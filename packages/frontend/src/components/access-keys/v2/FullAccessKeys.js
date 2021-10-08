import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    .access-keys-header {
        color: #72727A;
    }
    .access-key {
        padding: 20px 0;
        margin: 0;
        border-bottom: 1px solid #F0F0F1;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        :last-of-type {
            border: none;
        }
    }
`;

export default ({
    fullAccessKeys,
    onClick
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='verifyAccount.title' /></h1>
            <h2><Translate id='verifyAccount.desc' /></h2>
            <div className='access-keys-header'>Public Keys ({fullAccessKeys?.length})</div>
            <div className='access-keys'>
                {fullAccessKeys?.map((publicKey, i) => (
                    <div key={i} className='access-key' onClick={() => onClick(publicKey)}>
                        {publicKey.public_key}
                    </div>
                ))}
            </div>
        </StyledContainer>
    );
};