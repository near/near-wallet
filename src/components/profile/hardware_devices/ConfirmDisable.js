import React, { useState } from 'react';
import styled from 'styled-components';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';

const Container = styled.form`
    &&& {

        border: 2px solid #FF585D;
        border-radius: 6px;
        margin: 20px -21px -21px -21px;
        padding: 15px 20px;
        color: #24272a;
        line-height: 150%;

        div {
            :nth-child(1) {
                font-weight: 600;
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
            text-transform: uppercase;
            padding: 5px 15px;
            width: 152px;
        }
    
        .link {
            color: #999;
            margin-left: 15px;
            padding: 5px;
        }
    }
`

const ConfirmDisable = ({ onConfirmDisable, onKeepEnabled, accountId, disabling }) => {
    const [username, setUsername] = useState('');

    return (
        <Container onSubmit={e => {onConfirmDisable(); e.preventDefault();}}>
            <div><Translate id='hardwareDevices.disable.title'/></div>
            <div><Translate id='hardwareDevices.disable.desc'/></div>
            <Translate>
                {({ translate }) => (
                    <input
                        placeholder={translate('recoveryMgmt.disableInputPlaceholder')}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoComplete='off'
                        spellCheck='false'
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
                    <Translate id='hardwareDevices.disable.disable'/>
                </FormButton>
                <FormButton
                    onClick={onKeepEnabled}
                    color='link'
                    type='button'
                >
                    <Translate id='hardwareDevices.disable.keep'/>
                </FormButton>
            </div>
        </Container>
    )
}

export default ConfirmDisable;