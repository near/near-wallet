import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAccountConfirmed, setAccountConfirmed } from '../../utils/localStorage';
import { wallet } from '../../utils/wallet';
import { makeAccountActive } from '../actions/account';

export default createAsyncThunk(
    `refreshAccountOwner`,
    async ({ limitedAccountData }, { dispatch }) => {
        try {
            const account = await wallet.loadAccount(limitedAccountData);
            setAccountConfirmed(wallet.accountId, true);
            return account;
        } catch (error) {
            console.log('Error loading account:', error.message);

            if (error.toString().indexOf(`does not exist while viewing`) !== -1) {
                const accountId = wallet.accountId;
                const accountIdNotConfirmed = !getAccountConfirmed(accountId);

                // Try to find existing account and switch to it
                let nextAccountId = '';
                for (let curAccountId of Object.keys(wallet.accounts)) {
                    if (await wallet.accountExists(curAccountId)) {
                        nextAccountId = curAccountId;
                        break;
                    }
                }
                dispatch(makeAccountActive(nextAccountId));

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
            }

            throw error;
        }
    }
);
