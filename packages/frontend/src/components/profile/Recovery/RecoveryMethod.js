import React from 'react';

import ActiveMethod from './ActiveMethod';
import InactiveMethod from './InactiveMethod';

const RecoveryMethod = ({
    method,
    accountId,
    deletingMethod,
    onDelete,
    deleteAllowed,
    mainLoader
}) => {

    if (method.publicKey) {
        return (
            <ActiveMethod
                data={method}
                onDelete={onDelete}
                deletingMethod={deletingMethod}
                accountId={accountId}
                deleteAllowed={deleteAllowed}
                mainLoader={mainLoader}
            />
        );
    } else {
        return (
            <InactiveMethod
                method={method.kind}
                accountId={accountId}
            />
        );
    }
};

export default RecoveryMethod;
