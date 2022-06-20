import { createAsyncThunk } from '@reduxjs/toolkit';

import { isImplicitAccount } from '../../utils/account';
import { getAccountConfirmed, setAccountConfirmed } from '../../utils/localStorage';
import { wallet } from '../../utils/wallet';
import { makeAccountActive } from '../actions/account';
import { showCustomAlert } from '../actions/status';

export default createAsyncThunk(
    'refreshAccountOwner',
    async ({ limitedAccountData }, { dispatch }) => {
        try {
            const account = await wallet.loadAccount(limitedAccountData);
            setAccountConfirmed(wallet.accountId, true);
            return account;
        } catch (error) {
            console.log('Error loading account:', error.message);

            if (error.toString().indexOf('does not exist while viewing') !== -1) {
                const accountId = wallet.accountId;
                const accountIdNotConfirmed = !getAccountConfirmed(accountId);

                if (!isImplicitAccount(accountId)) {
                    // Only switch to the next account if it's a named account since an implicit account could be valid but not funded yet.
                    // Try to find existing account and switch to it
                    let nextAccountId = '';
                    for (let curAccountId of Object.keys(wallet.accounts)) {
                        if (await wallet.accountExists(curAccountId)) {
                            nextAccountId = curAccountId;
                            break;
                        }
                    }

                    if (nextAccountId) {
                        dispatch(makeAccountActive(nextAccountId));
                    }
                } else {
                    console.log(`NOTE: The account ${accountId} has no record on chain yet. Send NEAR to your account to begin using all features of the NEAR Wallet.`);
                }

                // TODO: Make sure "problem creating" only shows for actual creation
                return {
                    resetAccount: {
                        reset: true,
                        preventClear: accountIdNotConfirmed,
                        accountIdNotConfirmed: accountIdNotConfirmed ? accountId : ''
                    },
                    globalAlertPreventClear: accountIdNotConfirmed || wallet.isEmpty(),
                    globalAlert: {
                        success: false,
                        messageCode: 'account.create.errorAccountNotExist'
                    },
                    ...(!wallet.isEmpty() && !accountIdNotConfirmed && await wallet.loadAccount())
                };
            } else {
                dispatch(showCustomAlert({
                    success: false,
                    messageCodeHeader: 'error',
                    messageCode: 'walletErrorCodes.refreshAccountOwner.error',
                    errorMessage: error.message
                }));
            }

            throw error;
        }
    }
);
