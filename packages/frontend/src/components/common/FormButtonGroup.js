import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from './FormButton';

const StyledContainer = styled.div`
    &&& {
        display: flex;
        align-items: center;
    
        > button {
            flex: 1;

            :last-of-type {
                margin-left: 20px;
            }
        }
    }
`;

export default ({
    onClick,
    color = '',
    disabled = false,
    translateId
}) => {
    return (
        <StyledContainer className='form-button-group'>
            <FormButton 
                onClick={onClick.secondary}
                color={color.secondary}
                disabled={disabled.secondary}
            >
                    <Translate id={translateId.secondary} />
            </FormButton>
            <FormButton 
                onClick={onClick.primary}
                color={color.primary}
                disabled={disabled.primary}
            >
                    <Translate id={translateId.primary} />
            </FormButton>
        </StyledContainer>
    );
};