import React from 'react';
import { Translate } from 'react-localize-redux';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

import PhoneNumberInput from './PhoneNumberInput';
import VerifyOption from './VerifyOption';

export default ({
    translateIdTitle,
    translateIdDesc,
    onClick,
    activeVerificationOption,
    disabled,
    error,
    onChange,
    onBlur,
    value
}) => {

    return (
        <VerifyOption
            onClick={onClick}
            option='phone'
            isActive={activeVerificationOption === 'phone'}
            disabled={disabled}
            error={error}
            translateIdTitle={translateIdTitle}
            translateIdDesc={translateIdDesc}
        >
            <PhoneNumberInput
                translateIdPlaceholder='setupRecovery.phonePlaceholder'
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                disabled={disabled}
            />
        </VerifyOption>
    );
};