import { createSelector } from "reselect";

import createParameterSelector from "../createParameterSelector";

const SLICE_NAME = 'staking';

const getAccountIdParam = createParameterSelector((params) => params.accountId);
const getValidatorIdParam = createParameterSelector((params) => params.validatorId);

// Top level selectors
export const selectStakingSlice = (state) => state[SLICE_NAME] || {};

// accounts - state
export const selectStakingAccounts = createSelector(selectStakingSlice, (staking) => staking.accounts || []);

export const selectStakingCurrentAccountbyAccountId = createSelector(
    [selectStakingAccounts, getAccountIdParam], 
    (accounts, accountId) => accounts.find((account) => account.accountId === accountId)
);

export const selectStakingAccountsMain = createSelector(selectStakingAccounts, (accounts) => accounts[0] || {});

export const selectStakingAccountsLockup = createSelector(selectStakingAccounts, (accounts) => accounts[1] || {});

// lockup - state
export const selectStakingLockup = createSelector(selectStakingSlice, (staking) => staking.lockup || {});

export const selectStakingLockupId = createSelector(selectStakingLockup, (lockup) => lockup.lockupId || '');

export const selectStakingContract = createSelector(selectStakingLockup, (lockup) => lockup.contract || {});

// allValidators - state
export const selectStakingAllValidators = createSelector(selectStakingSlice, (staking) => staking.allValidators || []);

export const selectStakingAllValidatorsLength = createSelector(selectStakingAllValidators, (allValidators) => allValidators.length);

export const selectStakingFindContractByValidatorId = createSelector(
    [selectStakingAllValidators, getValidatorIdParam],
    (allValidators, validatorId) => allValidators.find((validator) => validator.accountId === validatorId)?.contract || {}
);

// accountsObj - state
const selectStakingAccountsObj = createSelector(selectStakingSlice, (staking) => staking.accountsObj || {});

export const selectStakingAccountsObjAccountId = createSelector(selectStakingAccountsObj, (accountsObj) => accountsObj.accountId || '');

export const selectStakingAccountsObjLockupId = createSelector(selectStakingAccountsObj, (accountsObj) => accountsObj.lockupId || '');

// currentAccount - state
const selectStakingCurrentAccount = createSelector(selectStakingSlice, (staking) => staking.currentAccount || {});

export const selectStakingCurrentAccountAccountId = createSelector(selectStakingCurrentAccount, (currentAccount) => currentAccount.accountId || '');
