import { createSelector } from 'reselect';

import createParameterSelector from '../../selectors/mainSelectors/createParameterSelector';

const SLICE_NAME = 'allAccounts';

const getAccountIdParam = createParameterSelector((params) => params.accountId);

// Top level selectors
export const selectAllAccountsSlice = (state) => state[SLICE_NAME];

export const selectAllAccountsByAccountId = createSelector(
    [selectAllAccountsSlice, getAccountIdParam],
    (allAccounts, accountId) => allAccounts[accountId] || {}
);

export const selectAllAccountsBalance = createSelector(
    [selectAllAccountsByAccountId],
    (account) => account.balance || {}
);

export const selectAllAccountsBalanceLockedAmount = createSelector(
    [selectAllAccountsBalance],
    (balance) => balance.lockedAmount || ''
);

export const selectAllAccountsHasLockup = createSelector(
    [selectAllAccountsByAccountId],
    (account) => account.hasLockup
);
