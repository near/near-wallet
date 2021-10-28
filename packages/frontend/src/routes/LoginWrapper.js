import { getLocation } from 'connected-react-router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ConfirmLoginWrapper from '../components/login/v2/ConfirmLoginWrapper';
import InvalidContractId from '../components/login/v2/InvalidContractId';
import SelectAccountLoginWrapper from '../components/login/v2/SelectAccountLoginWrapper';
import { Mixpanel } from '../mixpanel/index';
import {
    selectAccountLocalStorageAccountId
} from '../redux/slices/account';
import { LOCKUP_ACCOUNT_ID_SUFFIX } from '../utils/wallet';

export const LOGIN_ACCESS_TYPES = {
    FULL_ACCESS: 'fullAccess',
    LIMITED_ACCESS: 'limitedAccess'
};

export function LoginWrapper() {

    const [confirmLogin, setConfirmLogin] = useState(false);

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const contractId = URLParams.get('contract_id');
    const publicKey = URLParams.get('public_key');
    const failureUrl = URLParams.get('failure_url');
    const invalidContractId = URLParams.get('invalidContractId');

    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);

    const requestingFullAccess = !contractId || (publicKey && contractId?.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`)) || contractId === accountLocalStorageAccountId;
    const loginAccessType = requestingFullAccess ? LOGIN_ACCESS_TYPES.FULL_ACCESS : LOGIN_ACCESS_TYPES.LIMITED_ACCESS;

    if (invalidContractId) {
        return (
            <InvalidContractId
                invalidContractId={contractId}
                onClickReturnToApp={() => {
                    Mixpanel.track("LOGIN Invalid contract id Click return to app button", { contract_id: contractId });
                    window.location.href = failureUrl;
                }}
            />
        );
    }

    if (confirmLogin) {
        return (
            <ConfirmLoginWrapper
                loginAccessType={loginAccessType}
                contractId={contractId}
                onClickCancel={() => setConfirmLogin(false)}
            />
        );
    }

    return (
        <SelectAccountLoginWrapper
            loginAccessType={loginAccessType}
            failureUrl={failureUrl}
            onClickNext={() => { setConfirmLogin(true); window.scrollTo(0, 0); }}
        />
    );
}