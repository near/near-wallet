import React from 'react';
import { Translate } from 'react-localize-redux';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

import VerifyOption from './VerifyOption';

export default ({
    translateIdTitle,
    translateIdDesc,
    onClick,
    active,
    disabled,
    error,
    onChange,
    onBlur
}) => {

    return (
        <VerifyOption
            onClick={onClick}
            option='phone'
            active={active}
            disabled={disabled}
            error={error}
            translateIdTitle={translateIdTitle}
            translateIdDesc={translateIdDesc}
        >
            <Translate>
                {({ translate }) => (
                    <PhoneInput
                        placeholder={translate('setupRecovery.phonePlaceholder')}
                        type='phone'
                        value=''
                        disabled={false}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
            </Translate>
        </VerifyOption>
    );
};