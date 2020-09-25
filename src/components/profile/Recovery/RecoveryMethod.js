import React from 'react';
import ActiveMethod from './ActiveMethod';
import InactiveMethod from './InactiveMethod';

const RecoveryMethod = ({
    method,
    accountId,
    deletingMethod,
    onDelete,
    deleteAllowed
}) => {

    if (method.publicKey) {
        return (
            <ActiveMethod
                data={method}
                onDelete={onDelete}
                deletingMethod={deletingMethod}
                accountId={accountId}
                deleteAllowed={deleteAllowed}
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