import React from 'react';
import { Translate } from 'react-localize-redux';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import styled from 'styled-components';

import IntFlagIcon from '../../../../images/int-flag-small.svg';

const StyledContainer = styled.div`
    .react-phone-number-input {
        position: relative;

        .react-phone-number-input__country {
            position: absolute;
            right: 0;
            z-index: 1;
            top: 50%;
            transform: translateY(calc(-50% + 10px));
        }

        .react-phone-number-input__icon { 
            &:not(.react-phone-number-input__icon--international) {
                margin-right: 5px;
            }
        }

        .react-phone-number-input__icon--international {
            svg {
                display: none;
            }
            
            background-image: url(${IntFlagIcon});
            background-repeat: no-repeat;
        }

        .react-phone-number-input__icon {
            border: 0;
        }

        .react-phone-number-input__country-select-arrow {
            width: 8px;
            height: 8px;
            border-color: black;
            border-width: 0 1px 1px 0;
            transform: rotate(45deg);
            margin-top: -1px;
            margin-left: 5px;
            margin-right: 5px;
        }

        select {
            font-size: 16px;
        }
    }
`;

export default ({
    translateIdPlaceholder,
    onChange,
    onBlur,
    value,
    disabled
}) => {

    return (
        <StyledContainer>
            <Translate>
                {({ translate }) => (
                    <PhoneInput
                        placeholder={translate(translateIdPlaceholder)}
                        type='phone'
                        value={value}
                        disabled={disabled}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
            </Translate>
        </StyledContainer>
    );
};