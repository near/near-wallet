import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../common/FormButton';

const AccessKeysDeauthorizeConfirm = ({ handleConfirmSubmit, handleChange, accountId, confirmStatus, handleConfirmClear, mainLoader }) => (
    <form onSubmit={(e) => {handleConfirmSubmit(e); e.preventDefault();}}>
        <Translate>
            {({ translate }) => (
                <input
                    name='accountId'
                    value={accountId}
                    onChange={e => handleChange(e.target.value)}
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
                sending={mainLoader}
            >
                <Translate id='button.confirm' />
            </FormButton>
        </div>
    </form>
);

export default AccessKeysDeauthorizeConfirm;
