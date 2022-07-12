import React from 'react';

import PhoneNumberInput from './PhoneNumberInput';
import VerifyOption from './VerifyOption';

export default ({
    translateIdTitle,
    translateIdDesc,
    onClick,
    activeVerificationOption,
    disabled,
    error,
    onChangeVerificationNumber,
    onBlur,
    verificationNumber
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
                onChange={onChangeVerificationNumber}
                onBlur={onBlur}
                value={verificationNumber}
                disabled={disabled}
            />
        </VerifyOption>
    );
};
