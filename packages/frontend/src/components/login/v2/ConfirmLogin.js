import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Container from '../../common/styled/Container.css';
import LoginStyle from './LoginStyle.css';
import PermissionItem from './PermissionItem';

export default ({
    signedInAccountId,
    onClickCancel,
    onClickNext,
    loginAccessType,
    appReferrer
}) => (
    <Container className='small-centered border'>
        <LoginStyle className='confirm-login'>
            <h3><Translate id='login.v2.connectConfirm.title' data={{ accountId: signedInAccountId }} /></h3>
            <div className='desc'>
                <Translate>
                    {({ translate }) => (
                        <Translate
                            id='login.v2.connectConfirm.desc'
                            data={{
                                appReferrer: appReferrer || translate('sign.unknownApp'),
                                accessType: translate(`login.v2.connectConfirm.${loginAccessType}`)
                            }}
                        />
                    )}
                </Translate>
            </div>
            <PermissionItem translateId='login.v2.connectConfirm.permissions.viewAddress'/>
            <PermissionItem translateId='login.v2.connectConfirm.permissions.viewBalance'/>
            {
                loginAccessType === 'limitedAccess'
                ? <PermissionItem permitted={false} translateId='login.v2.connectConfirm.permissions.notTransferTokens'/>
                : <PermissionItem translateId='login.v2.connectConfirm.permissions.transferTokens'/>
            }
            <FormButtonGroup>
                <FormButton
                    onClick={onClickCancel}
                    color='gray-blue'
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickNext}
                >
                    <Translate id='button.connect' />
                </FormButton>
            </FormButtonGroup>
        </LoginStyle>
    </Container>
);