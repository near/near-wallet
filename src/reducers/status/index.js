import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

const initialState = {
    mainLoader: false,
    actionsPending: [],
    actionStatus: {},
    globalAlert: {},
    requestStatus: {}
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
    const mainLoader = Object.keys(actionStatus).reduce((x, action) => {
        if (x) {
            return x
        } else {
            if (actionStatus[action]?.pending) {
                return true
            } else {
                return x
            }
        }
    }, false)

    return {
        ...state,
        actionStatus,
        mainLoader,
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
                    console: error && (meta.alert?.console || payload.data?.console)
                }
                : undefined
        },
        requestStatus: meta?.alert?.requestStatus
            ? {
                show: ready,
                success: ready && !error,
                messageCode: `alert.${type}.${
                    ready
                        ? error
                            ? 'error'
                            : 'success'
                        : 'pending'
                }`
            }
            : undefined
    }
}
const clearReducer = handleActions({
    [clear]: state => Object.keys(state)
        .reduce((obj, key) => (
            key !== 'requestStatus' 
                ? (obj[key] = state[key], obj) 
                : obj)
        , {}),
    [clearAlert]: state => Object.keys(state)
        .reduce((obj, key) => (
            key !== 'globalAlert'
                ? (obj[key] = state[key], obj) 
                : obj
        , {}))
}
, initialState)
export default reduceReducers(
    initialState,
    alertReducer,
)
