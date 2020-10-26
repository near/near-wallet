import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

const initialState = {
}
const alertReducer = (state, { error, ready, payload, meta, type }) => {


    const actionStatus = {
        ...state.actionStatus,
    }
    return {
        ...state,
        actionStatus,
        globalAlert: {
            ...state.globalAlert,
            [type]: (meta?.alert?.showAlert || payload?.data?.showAlert)
                ? {
                    show: ready,
                    messageCode: 
                        payload?.messageCode 
                        || (error
                            ? payload.type
                                ? `alert.${payload.type}`
                                : `alert.${type}.error`
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
