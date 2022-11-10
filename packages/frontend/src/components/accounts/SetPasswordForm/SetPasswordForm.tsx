import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';


import FormButton from '../../common/FormButton';
import SetPassword from '../SetPassword';
import { WithoutPassword, PasswordForm, Submit } from './ui';

type SetPasswordFormProps = {
    onSubmit: (password: string) => void;
}

const SetPasswordForm: FC<SetPasswordFormProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [password, setPassword] = useState(null);

    const handlePasswordChange = useCallback((value) => {
        setPassword(value);
    }, []);

    const handleClickNext = useCallback(() => {
        if (password) {
            onSubmit(password);
        }
    }, [password]);

    return (
        <>
            <PasswordForm>
                <SetPassword onChange={handlePasswordChange} />
            </PasswordForm>
            <Submit>
                <FormButton
                    onClick={handleClickNext}
                    disabled={password === null}>
                    {t('button.next')}
                </FormButton>
            </Submit>
            <WithoutPassword hide={password !== null}>
                {t('setupPasswordProtection.withoutPassword')}
            </WithoutPassword>
        </>
    );
};

export default SetPasswordForm;
