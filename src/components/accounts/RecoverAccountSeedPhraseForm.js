import React from 'react'
import { Translate } from 'react-localize-redux'
import { Input } from 'semantic-ui-react'
import FormButton from '../common/FormButton'
import classNames from '../../utils/classNames'
import { actionsPending } from '../../utils/alerts'

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
                    <Input
                        name='seedPhrase'
                        value={seedPhrase}
                        onChange={handleChange}
                        className={classNames([{'success': localAlert && localAlert.success}, {'problem': localAlert && localAlert.success === false}])}
                        placeholder={translate('recoverSeedPhrase.seedPhraseInput.placeholder')}
                        disabled={mainLoader}
                        required
                        tabIndex='2'
                    />
                )}
            </Translate>
            <FormButton
                type='submit'
                color='blue'
                disabled={!isLegit || mainLoader}
                sending={actionsPending('RECOVER_ACCOUNT_SEED_PHRASE', 'REFRESH_ACCOUNT_OWNER')}
                sendingString='button.recovering'
            >
                <Translate id='button.findMyAccount' />
            </FormButton>
        </>
    )

export default RecoverAccountSeedPhraseForm
