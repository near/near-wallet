import React from 'react';

import classNames from '../../utils/classNames';
import FormButton from '../common/FormButton';


const Disable2FactoryAuthenticateForm = ({
    isLegit,
    handleChange,
    seedPhrase,
    localAlert,
    recoveringAccount,
    findMyAccountSending
}) => (
        <>
            <h4>Passphrase (12 words)</h4>
                <input
                    value={seedPhrase}
                    onChange={(e) => handleChange(e.target.value)}
                    className={classNames([{'success': localAlert && localAlert.success}, {'problem': localAlert && localAlert.success === false}])}
                    placeholder='Enter your passphrase'
                    disabled={recoveringAccount}
                    data-test-id="seedPhraseRecoveryInput"
                    required
                    tabIndex='2'
                    autoCapitalize='off'
                />
            <FormButton
                type='submit'
                color='blue'
                sending={findMyAccountSending}
                sendingString='button.recovering'
                data-test-id="seedPhraseRecoverySubmitButton"
                disabled={true}
            >
                Disable 2FA
            </FormButton>
        </>
);

export default Disable2FactoryAuthenticateForm;
