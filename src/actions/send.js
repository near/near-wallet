import { createActions } from 'redux-actions';

import { showAlert } from '../utils/alerts';
import { wallet } from '../utils/wallet';

export const transfer = ({ contractName, amount, memo, receiverId, isStorageBalanceAvailable }) => async (dispatch, gesState) => {
    if (!isStorageBalanceAvailable) {
        await dispatch(send.transfer.storageDeposit(contractName, receiverId));
    }

    const { transaction, status } = await dispatch(send.transfer[contractName ? 'TOKENS' : 'NEAR'](contractName, amount, memo, receiverId));

    if (status?.SuccessValue) {
        dispatch(send.setTxStatus(transaction.hash, 'success'));
    }
};

export const { send } = createActions({
    SEND: {
        TRANSFER: {
            NEAR: [
                wallet.sendMoney.bind(wallet),
                () => showAlert({ onlyError: true })
            ],
            TOKENS: [
                () => {},
                () => showAlert({ onlyError: true })
            ],
            STORAGE_DEPOSIT: [
                () => {},
                () => showAlert({ onlyError: true })
            ],
        },
        IS_STORAGE_BALANCE_AVAILABLE: [
            () => {},
            () => showAlert({ onlyError: true })
        ],
        SET_TX_STATUS: null,
    }
});
