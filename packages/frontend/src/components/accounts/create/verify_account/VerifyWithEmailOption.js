import React from 'react';
import { Translate } from 'react-localize-redux';

import VerifyOption from './VerifyOption';

export default ({
    translateIdTitle,
    translateIdDesc,
    onClick,
    activeVerificationOption,
    verificationEmail,
    disabled,
    onChangeVerificationEmail,
    onBlur
}) => {
    return (
        <VerifyOption
            onClick={onClick}
            option='email'
            isActive={activeVerificationOption === 'email'}
            disabled={disabled}
            translateIdTitle={translateIdTitle}
            translateIdDesc={translateIdDesc}
        >
            <Translate>
                {({ translate }) => (
                    <input
                        type='email'
                        placeholder={translate('setupRecovery.emailPlaceholder')}
                        value={verificationEmail}
                        disabled={disabled}
                        onChange={onChangeVerificationEmail}
                        onBlur={onBlur}
                    />
                )}
            </Translate>
        </VerifyOption>
    );
};