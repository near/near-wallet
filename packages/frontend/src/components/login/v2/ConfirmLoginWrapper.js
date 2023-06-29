import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ConfirmLogin from './ConfirmLogin';
import { Mixpanel } from '../../../mixpanel/index';
import { allowLogin } from '../../../redux/actions/account';
import {
    selectAccountLocalStorageAccountId,
    selectAccountUrlReferrer
} from '../../../redux/slices/account';
import { isUrlNotJavascriptProtocol } from '../../../utils/helper-api';

export default ({
    loginAccessType,
    contractId,
    contractIdUrl,
    onClickCancel,
    publicKey,
    successUrl
}) => {
    const dispatch = useDispatch();

    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);
    const successUrlIsValid = isUrlNotJavascriptProtocol(successUrl);

    return (
        <ConfirmLogin
            signedInAccountId={accountLocalStorageAccountId}
            loginAccessType={loginAccessType}
            appReferrer={accountUrlReferrer}
            publicKey={publicKey}
            contractId={contractId}
            onClickCancel={onClickCancel}
            onClickConnect={() => Mixpanel.withTracking('LOGIN', () => dispatch(allowLogin()))}
            contractIdUrl={contractIdUrl}
            successUrlIsValid={successUrlIsValid}
        />
    );
};
