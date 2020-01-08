import React, { Fragment } from 'react'
import { Input, Header } from 'semantic-ui-react'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'

const RecoverAccountSeedPhraseForm = ({
    formLoader,
    isLegit,
    handleChange,
    accountId,
    seedPhrase
}) => (
        <Fragment>
            <Fragment>
                <Header as='h3'>Username</Header>
                <AccountFormAccountId
                    formLoader={formLoader}
                    handleChange={handleChange}
                    defaultAccountId={accountId}
                />

                <Header as='h3'>Seed Phrase</Header>
                <Input
                    name='seedPhrase'
                    onChange={handleChange}
                    placeholder='correct horse battery staple'
                    value={seedPhrase}
                    required
                    tabIndex='2'
                    pattern='[a-zA-Z ]*'
                    style={{ width: '100%' }}
                />
            </Fragment>

            <FormButton
                type='submit'
                color='blue'
                disabled={!isLegit}
                sending={formLoader}
            >
                FIND MY ACCOUNT
            </FormButton>
        </Fragment>
    )

export default RecoverAccountSeedPhraseForm
