import { createActions } from 'redux-actions';

import { showAlert } from '../utils/alerts';
import { wallet } from '../utils/wallet';

export const TOKEN_TYPES = {
    NEAR: 'NEAR',
    NEP141: 'NEP141'
};

export const transfer = ({ 
    type,
    isStorageBalanceAvailable,
    params: {
        contractName, 
        amount, 
        memo, 
        receiverId
    }
}) => async (dispatch) => {

    if (type === TOKEN_TYPES.NEAR) {
        const { transaction, status } = await dispatch(send.transfer.near(receiverId, amount));

        if (status?.SuccessValue) {
            dispatch(send.setTxStatus(transaction.hash, 'success'));
        }
    } else if(type === TOKEN_TYPES.NEP141) {
        if (!isStorageBalanceAvailable) {
            await dispatch(send.payStorageDeposit(contractName, receiverId));
        }

        const { transaction, status } = await dispatch(send.transfer.nep141(contractName, amount, memo, receiverId));

        if (status?.SuccessValue) {
            dispatch(send.setTxStatus(transaction.hash, 'success'));
        }
    } else {
        throw new TypeError(`Could not transfer unsupported token: ${type}`);
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
