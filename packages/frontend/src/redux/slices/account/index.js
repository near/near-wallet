import { createSelector } from "reselect";

const SLICE_NAME = 'account';

// Top level selectors
export const selectAccountSlice = (state) => state[SLICE_NAME];

export const selectAccountId = createSelector(selectAccountSlice, (account) => account.accountId);

export const selectBalance = createSelector(selectAccountSlice, (account) => account.balance);

export const selectAccountHelperWalletState = createSelector(selectAccountSlice, (account) => account.accountHelperWalletState || {});

export const selectAccountRequiredUnlockBalance = createSelector(selectAccountHelperWalletState, (accountHelperWalletState) => accountHelperWalletState.requiredUnlockBalance);

export const selectAccountFundedAccountNeedsDeposit = createSelector(selectAccountHelperWalletState, (accountHelperWalletState) => accountHelperWalletState.fundedAccountNeedsDeposit);

export const selectAccountHas2fa = createSelector(selectAccountSlice, (account) => account.has2fa);
