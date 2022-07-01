import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';

const Container = styled.form`
    &&& {

        border: 2px solid #FF585D;
        border-radius: 8px;
        margin: -21px;
        padding: 15px 20px;
        color: #24272a;

        div {
            :nth-child(1) {
                font-weight: 600;
                margin-bottom: 10px;
            }
        }

        .buttons {
            margin-top: 10px;
            display: flex;
        }

        button {
            margin-top: 0;
        }

        .red {
            padding: 5px 15px;
            width: 155px;
        }
    
        .link {
            color: #999;
            margin-left: 15px;
            padding: 5px;
        }
    }
`;

const ConfirmDisable = ({ onConfirmDisable, onKeepEnabled, accountId, disabling, component, twoFactorKind }) => {
    const [username, setUsername] = useState('');

    const isTwoFactorPhone = component === 'twoFactor' && twoFactorKind === '2fa-phone';

    return (
        <Container onSubmit={(e) => {
            onConfirmDisable();
            e.preventDefault();
        }}>
            <div><Translate id={`${component}.disable.title`}/></div>
            <div><Translate id={`${component}.disable.${isTwoFactorPhone ? 'phoneDesc' : 'desc'}`}/></div>
            <Translate>
                {({ translate }) => (
                    <input
                        placeholder={translate('recoveryMgmt.disableInputPlaceholder')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete='off'
                        spellCheck='false'
                        disabled={disabling}
                    />
                )}
            </Translate>
            <div className='buttons'>
                <FormButton
                    type='submit'
                    color='red small'
                    sending={disabling}
                    disabled={(username !== accountId) || disabling}
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
