import React from 'react';
import { Translate } from 'react-localize-redux';

import AlertBanner from '../../common/AlertBanner';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Container from '../../common/styled/Container.css';
import SwapGraphic from '../../svg/SwapGraphic';
import GrantFullAccessModal from './GrantFullAccessModal';
import PermissionItem from './PermissionItem';
import LoginStyle from './style/LoginStyle.css';

export default ({
    signedInAccountId,
    onClickCancel,
    onClickConnect,
    onClickConfirmFullAccess,
    loginAccessType,
    appReferrer,
    showGrantFullAccessModal,
    onCloseGrantFullAccessModal
}) => (
    <>
        <Container className='small-centered border'>
            <LoginStyle className='confirm-login'>
                <SwapGraphic className='swap-graphic' />
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
                <PermissionItem translateId='login.v2.connectConfirm.permissions.viewAddress' />
                <PermissionItem translateId='login.v2.connectConfirm.permissions.viewBalance' />
                {
                    loginAccessType === 'limitedAccess'
                        ? <PermissionItem permitted={false} translateId='login.v2.connectConfirm.permissions.notTransferTokens' />
                        : <PermissionItem translateId='login.v2.connectConfirm.permissions.transferTokens' />
                }
                {loginAccessType !== 'limitedAccess' &&
                    <AlertBanner
                        title='login.v2.connectConfirm.fullAccessWarning'
                        theme='warning'
                    />
                }
                <FormButtonGroup>
                    <FormButton
                        onClick={onClickCancel}
                        color='gray-blue'
                    >
                        <Translate id='button.cancel' />
                    </FormButton>
                    <FormButton
                        onClick={onClickConnect}
                    >
                        <Translate id='button.connect' />
                    </FormButton>
                </FormButtonGroup>
            </LoginStyle>
        </Container>
        {showGrantFullAccessModal &&
            <GrantFullAccessModal
                open={showGrantFullAccessModal}
                onClose={onCloseGrantFullAccessModal}
                onConfirm={onClickConfirmFullAccess}
                appReferrer={appReferrer}
            />
        }
    </>
);