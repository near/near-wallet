import React, { Fragment } from 'react'
import { Translate } from 'react-localize-redux'
import { Input, Header } from 'semantic-ui-react'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'

const RecoverAccountSeedPhraseForm = ({
    formLoader,
    isLegit,
    handleChange,
    accountId,
    seedPhrase,
    checkAvailability,
    requestStatus
}) => (
        <Fragment>
            <Fragment>
                <Header as='h3'><Translate id='recoverSeedPhrase.accountIdInput.title' /></Header>
                <AccountFormAccountId
                    formLoader={formLoader}
                    handleChange={handleChange}
                    defaultAccountId={accountId}
                    checkAvailability={checkAvailability}
                    requestStatus={requestStatus}
                />

                <Header as='h3'><Translate id='recoverSeedPhrase.seedPhraseInput.title' /></Header>
                <Translate>
                    {({ translate }) => (
                        <Input
                            name='seedPhrase'
                            onChange={handleChange}
                            placeholder={translate('recoverSeedPhrase.seedPhraseInput.placeholder')}
                            value={seedPhrase}
                            required
                            tabIndex='2'
                            pattern='[a-zA-Z ]*'
                            style={{ width: '100%' }}
                        />
                    )}
                </Translate>
            </Fragment>

            <FormButton
                type='submit'
                color='blue'
                disabled={!isLegit}
                sending={formLoader}
            >
                <Translate id='button.findMyAccount' />
            </FormButton>
        </Fragment>
    )

export default RecoverAccountSeedPhraseForm
