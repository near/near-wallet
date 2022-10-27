import React, { FC, useCallback, useState } from 'react';
import { Translate } from 'react-localize-redux';

import { currentTargetValue } from '../../../shared/lib/forms/selectors';
import { inLength, isEqual, MIN_PASS_LEN } from './lib/validation';
import { Confirm, Enter } from './ui';
import ComplexityBlock from '../ComplexityBlock';
import { validatePassword } from '../ComplexityBlock/lib/complexity';
import Input from './ui/Input';

type SetPasswordProps = {
    onChange: (value: string|null) => void;
}

const SetPassword: FC<SetPasswordProps> = ({ onChange }) => {
    const [password, setPassword] = useState('');
    const [confirmPassValue, setConfirmPassValue] = useState('');
    const [lengthError, setLengthError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [isPassFocused, setPassFocused] = useState(false);

    const handleCommonChange = useCallback((pass: string, confirm: string) => {
        if (!inLength(pass)) {
            setLengthError(true);

            onChange(null);
            return;
        }
        setLengthError(false);

        if (!isEqual(pass, confirm)) {
            if (confirm.length) {
                setConfirmError(true);
            }

            onChange(null);
            return;
        }

        setConfirmError(false);
        onChange(pass);
    }, []);


    const handleChangePassword = useCallback((value: string) => {
        setPassword(value);
        handleCommonChange(value, confirmPassValue);
    }, [confirmPassValue]);

    const handlePasswordFocus = useCallback(() => {
        setPassFocused(true);
    }, []);

    const handlePasswordBlur = useCallback(() => {
        setPassFocused(false);
        handleCommonChange(password, confirmPassValue);
    }, [password, confirmPassValue]);

    const handleChangeConfirmPassword = useCallback((value: string) => {
        setConfirmPassValue(value);
        handleCommonChange(password, value);
    }, [password]);

    const handleConfirmBlur = useCallback(() => {
        handleCommonChange(password, confirmPassValue);
    }, [password, confirmPassValue]);

    const shouldShowConfirmError = confirmError && !isPassFocused;

    return (
        <>
            <Enter>
                <Translate>
                    {({ translate }) => (
                        <Input
                            error={lengthError ? translate('setupPasswordProtection.lengthError') as string : ''}
                            placeholder={translate('setupPasswordProtection.enter') as string}
                            value={password}
                            onChange={currentTargetValue(handleChangePassword)}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                        />
                    )}
                </Translate>
            </Enter>

            <Confirm>
                <Translate>
                    {({ translate }) => (
                        <Input
                            error={shouldShowConfirmError ? translate('setupPasswordProtection.matchError') as string : ''}
                            placeholder={translate('setupPasswordProtection.confirm') as string}
                            value={confirmPassValue}
                            onChange={currentTargetValue(handleChangeConfirmPassword)}
                            onBlur={handleConfirmBlur}
                        />
                    )}
                </Translate>
            </Confirm>
            <ComplexityBlock
                complexity={validatePassword(password, MIN_PASS_LEN)} />
        </>
    );
};

export default SetPassword;
