import React from 'react'
import { Translate } from 'react-localize-redux'

import FormButton from '../common/FormButton'

import { Input, Form } from 'semantic-ui-react'

const AccessKeysDeauthorizeConfirm = ({ handleConfirmSubmit, handleChange, accountId, confirmStatus, handleConfirmClear, formLoader }) => (
    <Form onSubmit={(e) => handleConfirmSubmit(e)}>
        <Translate>
            {({ translate }) => (
                <Input 
                    name='accountId'
                    value={accountId}
                    onChange={handleChange}
                    className={confirmStatus ? (confirmStatus === 'success' ? 'success' : 'problem') : ''}
                    placeholder={translate('login.confirm.username')}
                    maxLength='64'
                    required
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                    tabIndex='1'
                    autoFocus={true}
                />
            )}
        </Translate>
        <div className='alert-info'>
            {confirmStatus === 'problem' && <Translate id='account.nameDoesntMatch' />}
        </div>
        <div className='confirm'>
            <FormButton
                color='gray-white'
                onClick={handleConfirmClear}
                size='small'
                type='button'
            >
                <Translate id='button.cancel' />
            </FormButton>

            <FormButton
                color='blue'
                disabled={confirmStatus !== 'problem' && accountId ? false : true}
                size='small'
                type='submit'
                sending={formLoader}
            >
                <Translate id='button.confirm' />
            </FormButton>
        </div>
    </Form>
)

export default AccessKeysDeauthorizeConfirm
