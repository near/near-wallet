import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import { allowLogin } from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import {
    selectAccountLocalStorageAccountId,
    selectAccountUrlReferrer
} from '../../../redux/slices/account';
import { isUrlNotJavascriptProtocol } from '../../../utils/helper-api';
import ConfirmLogin from './ConfirmLogin';

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
            onClickConnect={async () => {
                await Mixpanel.withTracking('LOGIN',
                    async () => {
                        await dispatch(allowLogin());
                    },
                    (e) => {
                        dispatch(showCustomAlert({
                            success: false,
                            messageCodeHeader: 'error',
                            errorMessage: e.message
                        }));
                    }
                );
            }}
            contractIdUrl={contractIdUrl}
            successUrlIsValid={successUrlIsValid}
        />
    );
};
