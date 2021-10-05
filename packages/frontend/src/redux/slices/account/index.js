import { createSelector } from "reselect";

const SLICE_NAME = 'account';

// Top level selectors
export const selectAccountSlice = (state) => state[SLICE_NAME];

// Second level selectors 
export const selectAccountId = createSelector(selectAccountSlice, (account) => account.accountId);

export const selectAccountHas2fa = createSelector(selectAccountSlice, (account) => account.has2fa);

export const selectAccountAuthorizedApps = createSelector(selectAccountSlice, (account) => account.authorizedApps || []);

export const selectAccountLedgerKey = createSelector(selectAccountSlice, (account) => account.ledgerKey);

// balance - state
export const selectBalance = createSelector(selectAccountSlice, (account) => account.balance || {});

// helperWalletState - state
export const selectAccountHelperWalletState = createSelector(selectAccountSlice, (account) => account.accountHelperWalletState || {});

export const selectAccountRequiredUnlockBalance = createSelector(selectAccountHelperWalletState, (accountHelperWalletState) => accountHelperWalletState.requiredUnlockBalance);

export const selectAccountFundedAccountNeedsDeposit = createSelector(selectAccountHelperWalletState, (accountHelperWalletState) => accountHelperWalletState.fundedAccountNeedsDeposit);

// url - state
export const selectAccountUrl = createSelector(selectAccountSlice, (account) => account.url || {});

export const selectAccountUrlReferrer = createSelector(selectAccountUrl, (url) => url.referrer);

export const selectAccountUrlContractId = createSelector(selectAccountUrl, (url) => url.contract_id);
