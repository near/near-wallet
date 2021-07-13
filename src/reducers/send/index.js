import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';

import { send } from '../../actions/send'

const initialState = {
    items: []
}

const sendReducer = handleActions({
    [send.transfer.near]: (state, { payload, meta }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                items: [
                    ...state.items,
                    {
                        hash: payload.transaction.hash,
                        type: 'NEAR',
                        details: {
                            amount: meta.amount,
                            receiver: {
                                accountId: meta.receiverId
                            }
                        },
                        status: {
                            txStatus: 'pending',
                            networkFees: payload.transaction_outcome.outcome.gas_burnt,
                        }
                    }
                ]
            }),
}, initialState)

export default reduceReducers(
    initialState,
    sendReducer
);
