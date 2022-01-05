import { getLocation } from 'connected-react-router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ConfirmLoginWrapper from '../components/login/v2/ConfirmLoginWrapper';
import InvalidContractId from '../components/login/v2/InvalidContractId';
import SelectAccountLoginWrapper from '../components/login/v2/SelectAccountLoginWrapper';
import { EXPLORER_URL } from '../config';
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

    const contractIdUrl = `${EXPLORER_URL}/accounts/${contractId}`;

    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);

    let requestingFullAccess = !contractId || (publicKey && contractId?.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`)) || contractId === accountLocalStorageAccountId;
    const requestAccountIdOnly = !publicKey && !contractId;
    if (requestAccountIdOnly) {
        requestingFullAccess = false;
    }
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
                contractIdUrl={contractIdUrl}
                onClickCancel={() => setConfirmLogin(false)}
                publicKey={publicKey}
            />
        );
    }

    return (
        <SelectAccountLoginWrapper
            loginAccessType={loginAccessType}
            contractId={contractId}
            contractIdUrl={contractIdUrl}
            failureUrl={failureUrl}
            onClickNext={() => { setConfirmLogin(true); window.scrollTo(0, 0); }}
        />
    );
}