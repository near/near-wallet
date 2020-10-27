import { store } from '..'
import { clearAlert, clear } from '../actions/status'

export const showAlert = ({data, onlyError, onlySuccess, console = true, requestStatus, messageCodeHeader} = {}) => ({
    alert: {
        showAlert: requestStatus ? false : true,
        onlyError: onlySuccess ? false : true,
        onlySuccess: onlyError ? false : true,
        console,
        requestStatus,
        messageCodeHeader
    },
    data
})

export const dispatchWithAlert = (action, data) => store.dispatch({
    ...action,
    meta: {
        ...action.meta,
        ...showAlert(data)
    }
})

export const actionsPending = (types) => {
    const { actionStatus } = store.getState().status

    return (typeof types === 'string' ? [types] : types)
        .reduce((x, type) => {
            if (actionStatus[type]?.pending) {
                return true
            } else {
                return x
            }
        }, false)
}

export const handleClearAlert = () => {
    const { dispatch, getState } = store
    const { state: { globalAlertPreventClear } = {} } = getState().router.location
    const { account } = getState()

    if (!globalAlertPreventClear && !account.globalAlertPreventClear) {
        dispatch(clearAlert())
    }
    dispatch(clear())
}

