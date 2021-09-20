import React from 'react';
import { Translate } from 'react-localize-redux';

import { actionsPending } from '../../utils/alerts';
import classNames from '../../utils/classNames';
import FormButton from '../common/FormButton';

const RecoverAccountSeedPhraseForm = ({
    mainLoader,
    isLegit,
    handleChange,
    seedPhrase,
    localAlert
}) => (
        <>
            <h4><Translate id='recoverSeedPhrase.seedPhraseInput.title' /></h4>
            <Translate>
                {({ translate }) => (
                    <input
                        value={seedPhrase}
                        onChange={e => handleChange(e.target.value)}
                        className={classNames([{'success': localAlert && localAlert.success}, {'problem': localAlert && localAlert.success === false}])}
                        placeholder={translate('recoverSeedPhrase.seedPhraseInput.placeholder')}
                        disabled={mainLoader}
                        data-test-id="seedPhraseRecoveryInput"
                        required
                        tabIndex='2'
                        autoCapitalize='off'
                    />
                )}
            </Translate>
            <FormButton
                type='submit'
                color='blue'
                disabled={!isLegit || mainLoader}
                sending={actionsPending(['RECOVER_ACCOUNT_SEED_PHRASE', 'REFRESH_ACCOUNT_OWNER'])}
                sendingString='button.recovering'
                data-test-id="seedPhraseRecoverySubmitButton"
            >
                <Translate id='button.findMyAccount' />
            </FormButton>
        </>
    );

export default RecoverAccountSeedPhraseForm;
