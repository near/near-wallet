import { store } from '..'
import { clearAlert, clear } from '../actions/status'

export const showAlert = ({data, onlyError, onlySuccess, console = true, requestStatus} = {}) => {
    return {
        alert: {
            showAlert: requestStatus ? false : true,
            onlyError,
            onlySuccess,
            console,
            requestStatus
        },
        data
    }
}

export const dispatchWithAlert = (action, data) => store.dispatch({
    ...action,
    meta: {
        ...action.meta,
        ...showAlert(data)
    }})
export const handleClearAlert = () => {
    const { dispatch, getState } = store
    const { state: { globalAlertPreventClear } = {} } = getState().router.location
    const { account } = getState()

    if (!globalAlertPreventClear && !account.globalAlertPreventClear) {
        dispatch(clearAlert())
    }
    dispatch(clear())
}

