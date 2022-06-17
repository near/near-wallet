import { differenceBy } from 'lodash';

import { IMPORT_STATUS } from '.';

/**
 * @typedef {{ 
 *  accountId: string, 
 *  status: "pending" | "success" | "waiting" | "error" | null ,
 *  key: string,
 *  ledgerHdPath: string
 * }} account
 * 
 * @typedef {{accounts: account[], urlConfirmed: boolean}} state
 */

export const ACTIONS = {
    BEGIN_IMPORT: 'BEGIN_IMPORT',
    SET_CURRENT_DONE: 'SET_CURRENT_DONE',
    SET_CURRENT_FAILED: 'SET_CURRENT_FAILED',
    CONFIRM_URL: 'CONFIRM_URL',
    REMOVE_ACCOUNTS: 'REMOVE_ACCOUNTS',
};

/**
 * @type state
 */
const initialState = {
    accounts: [],
    urlConfirmed: false
};


/** 
 * @param {state} state
 * @returns {state} 
 * */
const sequentialAccountImportReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.REMOVE_ACCOUNTS: {
            if (state.accounts.every(({ status }) => status === null)) {
                state.accounts = differenceBy(
                    state.accounts,
                    action.accounts,
                    (accountOrId) => accountOrId?.accountId || accountOrId
                );
            }

            return;
        }
        case ACTIONS.BEGIN_IMPORT: {
            if (state.accounts.every(({ status }) => status === null)) {
                const [firstAccount, ...remainingAccounts] = state.accounts;

                firstAccount.status = IMPORT_STATUS.PENDING;
                remainingAccounts.forEach(
                    (account) => (account.status = IMPORT_STATUS.UP_NEXT)
                );
                state.urlConfirmed = false;
            }
            return;
        }
        case ACTIONS.SET_CURRENT_DONE: {
            const currentIndex = state.accounts.findIndex(
                (account) => account.status === IMPORT_STATUS.PENDING
            );
            state.accounts[currentIndex].status = IMPORT_STATUS.SUCCESS;
            if (state.accounts[currentIndex + 1]) {
                state.accounts[currentIndex + 1].status = IMPORT_STATUS.PENDING;
            }
            return;
        }
        case ACTIONS.SET_CURRENT_FAILED: {
            const currentIndex = state.accounts.findIndex(
                (account) => account.status === IMPORT_STATUS.PENDING
            );
            state.accounts[currentIndex].status = IMPORT_STATUS.FAILED;
            if (state.accounts[currentIndex + 1]) {
                state.accounts[currentIndex + 1].status = IMPORT_STATUS.PENDING;
            }
            return;
        }
        case ACTIONS.CONFIRM_URL:
            state.urlConfirmed = true;
            return;
    }
};

export default sequentialAccountImportReducer;
