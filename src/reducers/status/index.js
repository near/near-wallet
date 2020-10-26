import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

const initialState = {
}
const alertReducer = (state, { error, ready, payload, meta, type }) => {


    return {
        ...state,
        globalAlert: {
            ...state.globalAlert,
            [type]: (meta?.alert?.showAlert || payload?.data?.showAlert)
                ? {
                    show: ready,
                    messageCode: 
                        payload?.messageCode 
                        || (error ? 
                                 `alert.${type}.error`
                            : `alert.${type}.success`),
                }
                : undefined
        },
    }
}
export default reduceReducers(
    initialState,
    alertReducer,
)
