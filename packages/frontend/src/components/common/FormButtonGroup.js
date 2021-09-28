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
    color,
    disabled,
    sending,
    translateId
}) => {
    return (
        <StyledContainer className='button-group'>
            <FormButton 
                onClick={onClick?.secondary}
                color={color?.secondary}
                disabled={disabled?.secondary}
                sending={sending?.secondary}
            >
                    <Translate id={translateId.secondary} />
            </FormButton>
            <FormButton 
                onClick={onClick?.primary}
                color={color?.primary}
                disabled={disabled?.primary}
                sending={sending?.primary}
            >
                    <Translate id={translateId.primary} />
            </FormButton>
        </StyledContainer>
    );
};