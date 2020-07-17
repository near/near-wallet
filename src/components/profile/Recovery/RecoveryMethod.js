import React from 'react';
import ActiveMethod from './ActiveMethod';
import InactiveMethod from './InactiveMethod';

const RecoveryMethod = ({
    method,
    accountId,
    resendingLink,
    deletingMethod,
    onResend,
    onDelete
}) => {

    if (method.publicKey) {
        return (
            <ActiveMethod
                data={method}
                onResend={onResend}
                onDelete={onDelete}
                deletingMethod={deletingMethod}
                resendingLink={resendingLink}
                accountId={accountId}
            />
        )
    } else {
        return (
            <InactiveMethod
                method={method.kind}
                accountId={accountId}
            />
        )
    }
}

export default RecoveryMethod;