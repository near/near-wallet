import React from 'react';
import { Translate } from 'react-localize-redux';

import AlertBanner from '../../common/AlertBanner';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Container from '../../common/styled/Container.css';
import SafeTranslate from '../../SafeTranslate';
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
    contractId,
    showGrantFullAccessModal,
    onCloseGrantFullAccessModal,
    EXPLORER_URL,
    loggingIn,
    onChangeUserInputValue,
    userInputValue
}) => (
    <>
        <Container className='small-centered border'>
            <LoginStyle className='confirm-login'>
                <SwapGraphic className='swap-graphic' />
                <h3><Translate id='login.v2.connectConfirm.title' data={{ accountId: signedInAccountId }} /></h3>
                <div className='desc'>
                    <Translate>
                        {({ translate }) => (
                            <SafeTranslate
                                id='login.v2.connectConfirm.desc'
                                data={{
                                    contractIdUrl: `${EXPLORER_URL}/accounts/${contractId}`,
                                    appReferrer: appReferrer || translate('sign.unknownApp'),
                                    accessType: translate(`login.v2.connectConfirm.${loginAccessType}`)
                                }}
                            />
                        )}
                    </Translate>
                </div>
                {loginAccessType === 'limitedAccess'
                    ? <LimitedAccessUI/>
                    : <FullAccessUI/>
                }
                <FormButtonGroup>
                    <FormButton
                        onClick={onClickCancel}
                        color='gray-blue'
                        disabled={loggingIn}
                    >
                        <Translate id='button.cancel' />
                    </FormButton>
                    <FormButton
                        onClick={onClickConnect}
                        disabled={loggingIn}
                        sending={loggingIn}
                        sendingString='button.connecting'
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
                onChangeUserInputValue={onChangeUserInputValue}
                userInputValue={userInputValue}
                onConfirm={onClickConfirmFullAccess}
                signedInAccountId={signedInAccountId}
                appReferrer={appReferrer}
                loggingIn={loggingIn}
            />
        }
    </>
);

const LimitedAccessUI = () => (
    <>
        <PermissionItem translateId='login.v2.connectConfirm.permissions.viewAddress' />
        <PermissionItem translateId='login.v2.connectConfirm.permissions.viewBalance' />
        <PermissionItem permitted={false} translateId='login.v2.connectConfirm.permissions.notTransferTokens' />
    </>
);

const FullAccessUI = () => (
    <>
        <PermissionItem translateId='login.v2.connectConfirm.permissions.viewAddress' />
        <PermissionItem translateId='login.v2.connectConfirm.permissions.viewBalance' />
        <PermissionItem translateId='login.details.createNewAccounts' />
        <PermissionItem translateId='login.details.transferTokens' />
        <PermissionItem translateId='login.details.deploySmartContracts' />
        <PermissionItem translateId='login.details.callFunctions' />
        <PermissionItem translateId='login.details.stakeAndUnstake' />
        <PermissionItem translateId='login.details.createAndDeleteAccessKeys' />
        <AlertBanner
            title='login.v2.connectConfirm.fullAccessWarning'
            theme='warning'
        />
    </>
);