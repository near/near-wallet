import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import { Container } from './ui';

const ConfirmDisable = ({
    onConfirmDisable,
    onKeepEnabled,
    accountId,
    isDisable,
    component,
    twoFactorKind
}) => {
    const [username, setUsername] = useState('');

    const isTwoFactorPhone = component === 'twoFactor' && twoFactorKind === '2fa-phone';

    return (
        <Container onSubmit={(e) => {
            onConfirmDisable();
            e.preventDefault();
        }}>
            <div>
                <Translate id={`${component}.disable.title`}/>
            </div>
            <div>
                <Translate
                    id={`${component}.disable.${isTwoFactorPhone ? 'phoneDesc' : 'desc'}`}/>
            </div>
            <Translate>
                {({ translate }) => (
                    <input
                        placeholder={translate('recoveryMgmt.disableInputPlaceholder')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete='off'
                        spellCheck='false'
                        disabled={isDisable}
                    />
                )}
            </Translate>
            <div className='buttons'>
                <FormButton
                    type='submit'
                    color='red small'
                    sending={isDisable}
                    disabled={(username !== accountId) || isDisable}
                >
                    <Translate id={`${component}.disable.disable`}/>
                </FormButton>
                <FormButton
                    onClick={onKeepEnabled}
                    color='link'
                    type='button'
                >
                    <Translate id={`${component}.disable.keep`}/>
                </FormButton>
            </div>
        </Container>
    );
};

export default ConfirmDisable;
