import { createActions } from 'redux-actions';

import { showAlert } from '../utils/alerts';

export const transfer = ({ contractName, amount, memo, receiverId, isStorageBalanceAvailable }) => async (dispatch, gesState) => {
    if (!isStorageBalanceAvailable) {
        await dispatch(send.transfer.storageDeposit(contractName, receiverId));
    }
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
