import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';

const Container = styled.div`
    &&& {
        border: 2px solid #F0F0F0;
        border-radius: 8px;
        padding: 20px;

        .title {
            color: #3F4045;
            font-weight: 600;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > button {
                margin: 0;
            }

            &.disable {
                margin-bottom: 10px;
            }
        }

        .desc {
            margin-bottom: 20px;
        }

        .key {
            color: #3F4045;
            background-color: #FAFAFA;
            border: 1px solid #F0F0F1;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            line-break: anywhere;
        }

        input {
            margin-top: 20px;
        }
    }
`;

export default ({
    accessKey,
    onClickDeAuthorizeKey,
    deAuthorizing,
    userInputAccountId,
    setUserInputAccountId,
    accountId,
    confirmDeAuthorizeKey,
    setConfirmDeAuthorizeKey
}) => {
    return (
        <Container className='authorized-app-box'>
            {confirmDeAuthorizeKey !== accessKey.public_key &&
                <>
                    <div className='title'>
                        <Translate id='authorizedApps.publicKey' /> {accessKey.meta.type === 'ledger' ? <>- <Translate id='hardwareDevices.ledger.title' /></> : ``}
                        {setConfirmDeAuthorizeKey &&
                            <FormButton color='gray-red' className='small'
                                onClick={() => {
                                    setConfirmDeAuthorizeKey(accessKey.public_key);
                                    setUserInputAccountId('');
                                }}
                                disabled={deAuthorizing}
                                sending={deAuthorizing}
                                sendingString='button.deAuthorizing'
                            >
                                <Translate id='button.deauthorize' />
                            </FormButton>}
                    </div>
                    <div className='key font-monospace'>{accessKey.public_key}</div>
                </>
            }
            {confirmDeAuthorizeKey === accessKey.public_key &&
                <>
                    <div className='title disable'><Translate id='fullAccessKeys.deAuthorizeConfirm.title' /></div>
                    <div className='desc'><Translate id='fullAccessKeys.deAuthorizeConfirm.desc' /></div>
                    <div className='key font-monospace'>{accessKey.public_key}</div>
                    <form onSubmit={e => { onClickDeAuthorizeKey(accessKey.public_key); e.preventDefault(); }} autoComplete='off'>
                        <Translate>
                            {({ translate }) => (
                                <input
                                    placeholder={translate('recoveryMgmt.disableInputPlaceholder')}
                                    value={userInputAccountId}
                                    onChange={e => setUserInputAccountId(e.target.value)}
                                    autoComplete='off'
                                    spellCheck='false'
                                    disabled={deAuthorizing}
                                    autoFocus={true}
                                />
                            )}
                        </Translate>
                        <FormButtonGroup>
                            <FormButton
                                onClick={() => {
                                    setConfirmDeAuthorizeKey('');
                                    setUserInputAccountId('');
                                }}
                                color='gray-white'
                                disabled={deAuthorizing}
                                type='button'
                            >
                                <Translate id='button.cancel' />
                            </FormButton>
                            <FormButton
                                disabled={deAuthorizing || (userInputAccountId !== accountId)}
                                sending={deAuthorizing}
                                sendingString='button.deAuthorizing'
                                color='red'
                                type='submit'
                            >
                                <Translate id='button.approve' />
                            </FormButton>
                        </FormButtonGroup>
                    </form>
                </>
            }
        </Container>
    );
};