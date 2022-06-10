import { IMPORT_STATUS } from "./BatchImportAccounts";

export const ACTIONS = {
  BEGIN_IMPORT: 'BEGIN_IMPORT',
  SET_CURRENT_DONE: 'SET_CURRENT_DONE',
  SET_CURRENT_FAILED: 'SET_CURRENT_FAILED',
  CONFIRM_URL: 'CONFIRM_URL',
  REMOVE_ACCOUNTS: 'REMOVE_ACCOUNTS'
};

const reducer = (state, action) => {
  switch (action.type) {
      case ACTIONS.REMOVE_ACCOUNTS: {
        if (!state.accounts.every(({ status }) => status === null)) {
          return state;
        }
        
        return {
          ...state,
          accounts: state.accounts.filter(
            (account) =>
                !action.accounts.some(
                    (accountId) => account.accountId === accountId
                )
          )
        };
      }
      case ACTIONS.BEGIN_IMPORT: {
          if(!state.accounts.every(({ status }) => status === null)) {
            return state;
          }

          const [firstAccount, ...remainingAccounts] = state.accounts;
          return {
            accounts: [
              { ...firstAccount, status: IMPORT_STATUS.PENDING },
              ...remainingAccounts.map((account) => ({ ...account, status: IMPORT_STATUS.UP_NEXT })),
            ],
            urlConfirmed: false,
          }
      }
      case ACTIONS.SET_CURRENT_DONE: {
          const currentIndex = state.accounts.findIndex(
              (account) => account.status === IMPORT_STATUS.PENDING
          );
          return {
              accounts: state.accounts.map((account, idx) => ({
                  ...account,
                  status: {
                    [currentIndex]: IMPORT_STATUS.SUCCESS,
                    [currentIndex + 1]: IMPORT_STATUS.PENDING
                  }[idx] || account.status
              })),
              urlConfirmed: true,
          };
      }
      case ACTIONS.SET_CURRENT_FAILED: {
          const currentIndex = state.accounts.findIndex(
              (account) => account.status === IMPORT_STATUS.PENDING
          );
          return {
              accounts: state.accounts.map((account, idx) => ({
                  ...account,
                  status: {
                    [currentIndex]: IMPORT_STATUS.FAILED,
                    [currentIndex + 1]: IMPORT_STATUS.PENDING
                  }[idx] || account.status
              })),
              urlConfirmed: true,
          };
      }
      case ACTIONS.CONFIRM_URL:
          return {
              ...state,
              urlConfirmed: true,
          };
      default:
          return state;
  }
};

export default reducer