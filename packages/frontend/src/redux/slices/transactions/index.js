import { createSelector } from 'reselect';

const SLICE_NAME = 'transactions';

// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
function createParameterSelector(selector) {
    return (_, params) => selector(params);
}

const getAccountIdParam = createParameterSelector((params) => params.accountId);

const getHashParam = createParameterSelector((params) => params.hash);

// Top level selectors
const selectTransactionsSlice = (state) => state[SLICE_NAME] || {};

export const selectTransactionsByAccountId = createSelector(
    [selectTransactionsSlice, getAccountIdParam],
    (transactions, accountId) => transactions[accountId] || []
);

export const selectOneTransactionByHash = createSelector(
    [selectTransactionsByAccountId, getHashParam],
    (transactionsByAccountId, hash) => transactionsByAccountId.find((transaction) => `${transaction.hash}-${transaction.kind}` === hash)
);
