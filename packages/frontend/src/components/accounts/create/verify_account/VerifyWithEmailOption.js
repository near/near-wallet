import React from 'react';
import { Translate } from 'react-localize-redux';

import VerifyOption from './VerifyOption';

export default ({
    translateIdTitle,
    translateIdDesc,
    onClick,
    active,
    value,
    disabled,
    onChange,
    onBlur
}) => {
    return (
        <VerifyOption
            onClick={onClick}
            option='email'
            active={active}
            disabled={disabled}
            translateIdTitle={translateIdTitle}
            translateIdDesc={translateIdDesc}
        >
            <Translate>
                {({ translate }) => (
                    <input
                        type='email'
                        placeholder={translate('setupRecovery.emailPlaceholder')}
                        value={value}
                        disabled={disabled}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
            </Translate>
        </VerifyOption>
    );
};