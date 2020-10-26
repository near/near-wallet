import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

const initialState = {
}
const alertReducer = (state, { error, ready, payload, meta, type }) => {


    const actionStatus = {
        ...state.actionStatus,
        [type]: {
            success: typeof ready === 'undefined' 
                ? !error
                : (ready ? !error : undefined),
            pending: typeof ready === 'undefined' 
                ? undefined 
                : !ready,
            errorType: payload?.type,
            errorMessage: (error && payload?.toString()) || undefined,
            data: (meta?.data || error) 
                ? {
                    ...meta?.data,
                    ...(error && payload)
                } 
    }
                } 
                : undefined
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
