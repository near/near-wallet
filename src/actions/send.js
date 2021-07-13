import { createActions } from 'redux-actions';

import { showAlert } from '../utils/alerts';
import { wallet } from '../utils/wallet';
import { WalletError } from '../utils/walletError';

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
        receiverId,
        memo
    }
}) => async (dispatch, getState) => {
    if (type === TOKEN_TYPES.NEAR) {
        const { transaction, status } = await dispatch(send.transfer.near(receiverId, amount));

        if (status?.SuccessValue) {
            dispatch(send.setTxStatus(transaction.hash, 'success'));
        }
    } else if(type === TOKEN_TYPES.NEP141) {
        if (isStorageBalanceAvailable === false) {
            await dispatch(send.payStorageDeposit(contractName, receiverId));
        }

        const { transaction: { hash }, status } = await dispatch(send.transfer.nep141({
            token: { 
                contractName,
                metadata: { 
                    decimals: getState().tokens.tokens[contractName].decimals
                }
            },
            amount,
            receiverId,
            memo
        }));

        if (status?.SuccessValue === '') {
            dispatch(send.setTxStatus({
                hash,
                newStatus: 'success'
            }));
        }
    } else {
        throw new WalletError(`Could not transfer unsupported token: ${type}`, 'send.unsupportedToken', { type });
    }
};

export const { send } = createActions({
    SEND: {
        TRANSFER: {
            NEAR: [
                wallet.sendMoney.bind(wallet),
                (receiverId, amount) => ({
                    ...showAlert({ onlyError: true }),
                    receiverId,
                    amount
                })
            ],
            NEP141: [
                wallet.fungibleTokens.transfer.bind(wallet),
                () => showAlert({ onlyError: true })
            ],
        },
        PAY_STORAGE_DEPOSIT: [
            wallet.fungibleTokens.transferStorageDeposit.bind(wallet),
            () => showAlert({ onlyError: true })
        ],
        IS_STORAGE_BALANCE_AVAILABLE: [
            wallet.fungibleTokens.isStorageBalanceAvailable.bind(wallet),
            () => showAlert({ onlyError: true })
        ],
        SET_TX_STATUS: null,
    }
});
