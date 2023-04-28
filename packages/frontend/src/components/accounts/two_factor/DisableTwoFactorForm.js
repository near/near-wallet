import React from 'react';

import classNames from '../../../utils/classNames';
import FormButton from '../../common/FormButton';


const DisableTwoFactorForm = ({
    isLegit,
    handleChange,
    seedPhrase,
    localAlert,
    disablingTwoFactor,
}) => (
        <>
            <h4>Passphrase (12 words)</h4>
                <input
                    value={seedPhrase}
                    onChange={(e) => handleChange(e.target.value)}
                    className={classNames([{'success': localAlert && localAlert.success}, {'problem': localAlert && localAlert.success === false}])}
                    placeholder='Enter your passphrase'
                    disabled={disablingTwoFactor}
                    data-test-id="seedPhraseDisableTwoFactorInput"
                    required
                    tabIndex='2'
                    autoCapitalize='off'
                />
            <FormButton
                type='submit'
                color='blue'
                sending={disablingTwoFactor}
                sendingString='button.disabling2FA'
                data-test-id="seedPhraseDisableTwoFactorSubmitButton"
                disabled={!isLegit || disablingTwoFactor}
            >
                Disable 2FA
            </FormButton>
        </>
);

export default DisableTwoFactorForm;
