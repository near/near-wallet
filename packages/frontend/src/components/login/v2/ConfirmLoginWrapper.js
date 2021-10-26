import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import { allowLogin } from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import { EXPLORER_URL } from '../../../utils/wallet';
import ConfirmLogin from './ConfirmLogin';
import { LOGIN_ACCESS_TYPES } from './LoginWrapper';

export default ({
    signedInAccountId,
    loginAccessType,
    appReferrer,
    contractId,
    onClickCancel
}) => {
    const dispatch = useDispatch();

    const [showGrantFullAccessModal, setShowGrantFullAccessModal] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const handleAllowLogin = async () => {
        await Mixpanel.withTracking("LOGIN",
            async () => {
                setLoggingIn(true);
                await dispatch(allowLogin());
            },
            (e) => {
                dispatch(showCustomAlert({
                    success: false,
                    messageCodeHeader: 'error',
                    errorMessage: e.message
                }));
                setLoggingIn(false);
            }
        );
    };

    return (
        <ConfirmLogin
            signedInAccountId={signedInAccountId}
            loginAccessType={loginAccessType}
            appReferrer={appReferrer}
            contractId={contractId}
            onClickCancel={onClickCancel}
            onClickConnect={async () => {
                if (loginAccessType === LOGIN_ACCESS_TYPES.FULL_ACCESS) {
                    setShowGrantFullAccessModal(true);
                    return;
                }
                handleAllowLogin();
            }}
            onClickConfirmFullAccess={() => handleAllowLogin()}
            loggingIn={loggingIn}
            showGrantFullAccessModal={showGrantFullAccessModal}
            onCloseGrantFullAccessModal={() => setShowGrantFullAccessModal(false)}
            EXPLORER_URL={EXPLORER_URL}
        />
    );
};