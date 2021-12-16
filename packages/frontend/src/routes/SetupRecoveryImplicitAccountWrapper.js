import React from 'react';

import SetupRecoveryImplicitAccount from '../components/accounts/create/implicit_account/SetupRecoveryImplicitAccount';

export function SetupRecoveryImplicitAccountWrapper() {
    return (
        <SetupRecoveryImplicitAccount
            onClickSecureMyAccount={({
                recoveryOption,
                email
            }) => {
                console.log('secure my account with:', recoveryOption);
            }}
        />
    );
}