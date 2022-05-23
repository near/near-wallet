import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import ExportPrivateKeyImage from '../../../images/icon-key.svg';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    margin-top: 16px;
    padding-top: 0;
    padding-bottom: 0;

    > button {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .export-private-key-icon {
       margin-right: 12px;
       width: 20px;
       height: 19px;
    }
`;

export default () => {
    return (
        <StyledContainer>
            <FormButton 
                color='gray-blue'
            >
                <img src={ExportPrivateKeyImage} className='export-private-key-icon' />
                <Translate id='exportPrivateKey.button' />
            </FormButton>
        </StyledContainer>
    );
};
