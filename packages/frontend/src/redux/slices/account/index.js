import { createSelector } from 'reselect';

import { isImplicitAccount } from '../../../utils/account';

export const SLICE_NAME = 'account';

// Top level selectors
export const selectAccountSlice = (state) => state[SLICE_NAME];

// Second level selectors 
export const selectAccountId = createSelector(selectAccountSlice, (account) => account.accountId);

export const selectActiveAccountIdIsImplicitAccount = createSelector(selectAccountSlice, (account) => isImplicitAccount(account.accountId));

export const selectAccountExists = createSelector(selectAccountSlice, (account) => account.accountExists);

export const selectAccountHas2fa = createSelector(selectAccountSlice, (account) => account.has2fa);

export const selectAccountHasLockup = createSelector(selectAccountSlice, (account) => account.hasLockup);

export const selectAccountAuthorizedApps = createSelector(selectAccountSlice, (account) => account.authorizedApps || []);

export const selectAccountFullAccessKeys = createSelector(selectAccountSlice, (account) => account.fullAccessKeys || []);

export const selectAccountLedgerKey = createSelector(selectAccountSlice, (account) => account.ledgerKey);

export const selectAccountGlobalAlertPreventClear = createSelector(selectAccountSlice, (account) => account.globalAlertPreventClear);

export const selectAccountMultisigRequest = createSelector(selectAccountSlice, (account) => account.multisigRequest);

// balance - state
export const selectBalance = createSelector(selectAccountSlice, (account) => account.balance || {});

export const selectAvailableBalance = createSelector(selectBalance, (balance) => balance.balanceAvailable);

export const selectAccountBalanceLockedAmount = createSelector(selectBalance, (balance) => balance.lockedAmount || '');

// accountsBalance - state
export const selectAccountAccountsBalances = createSelector(selectAccountSlice, (account) => account.accountsBalance || {});

// localStorage - state
export const selectAccountLocalStorage = createSelector(selectAccountSlice, (account) => account.localStorage || {});

export const selectAccountLocalStorageAccountId = createSelector(selectAccountLocalStorage, (localStorage) => localStorage.accountId);

// url - state
export const selectAccountUrl = createSelector(selectAccountSlice, (account) => account.url || {});

export const selectAccountUrlReferrer = createSelector(selectAccountUrl, (url) => url.referrer);

export const selectAccountUrlContractId = createSelector(selectAccountUrl, (url) => url.contract_id);

export const selectAccountUrlFailureUrl = createSelector(selectAccountUrl, (url) => url.failure_url);

export const selectAccountUrlPublicKey = createSelector(selectAccountUrl, (url) => url.public_key);

export const selectAccountUrlMethodNames = createSelector(selectAccountUrl, (url) => url.methodNames);

export const selectAccountUrlTitle = createSelector(selectAccountUrl, (url) => url.title);

export const selectAccountUrlSuccessUrl = createSelector(selectAccountUrl, (url) => url.success_url);

export const selectAccountUrlRedirectUrl = createSelector(selectAccountUrl, (url) => url.redirectUrl);

export const selectAccountUrlTransactions = createSelector(selectAccountUrl, (url) => url.transactions);

export const selectAccountUrlCallbackUrl = createSelector(selectAccountUrl, (url) => url.callbackUrl);

export const selectAccountUrlMeta = createSelector(selectAccountUrl, (url) => url.meta);
