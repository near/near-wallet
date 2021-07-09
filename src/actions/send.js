import { createActions } from 'redux-actions';

import { showAlert } from '../utils/alerts';
export const transfer = ({ contractName, amount, memo, receiverId, isStorageBalanceAvailable }) => async (dispatch, gesState) => {
};

export const { send } = createActions({
    SEND: {
        TRANSFER: {
            STORAGE_DEPOSIT: [
                () => {},
                () => showAlert({ onlyError: true })
            ],
        },
    }
});
