import React from 'react';
import { useDispatch } from 'react-redux';

import {
    redirectTo,
    refreshAccount
} from '../../redux/actions/account';
import { showCustomAlert, clearGlobalAlert } from '../../redux/actions/status';
import { getImplicitAccountIdFromSeedPhrase, getKeyPairFromSeedPhrase } from '../../utils/parseSeedPhrase';
import { wallet } from '../../utils/wallet';
import { CouldNotFindAccountModal } from './CouldNotFindAccountModal';

export function CouldNotFindAccountModalWrapper ({
    isOpen,
    onClose,
    seedPhrase
}) {
    const dispatch = useDispatch();
    return (
        <CouldNotFindAccountModal
            isOpen={isOpen}
            onClose={onClose}
            onClickImport={async () => {
                const recoveryKeyPair = getKeyPairFromSeedPhrase(seedPhrase);
                const implicitAccountId = getImplicitAccountIdFromSeedPhrase(seedPhrase);
                try {
                    await wallet.importZeroBalanceAccount(implicitAccountId, recoveryKeyPair);
                    dispatch(refreshAccount());
                    dispatch(redirectTo('/'));
                    dispatch(clearGlobalAlert());
                } catch (e) {
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'walletErrorCodes.recoverAccountSeedPhrase.errorNotAbleToImportAccount',
                        errorMessage: e.message
                    }));
                }
            }}
        />
    );
};

