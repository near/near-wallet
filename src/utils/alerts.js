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
export const handleClearAlert = () => {
    const { dispatch, getState } = store
    const { state: { globalAlertPreventClear } = {} } = getState().router.location
    const { account } = getState()

    if (!globalAlertPreventClear && !account.globalAlertPreventClear) {
        dispatch(clearAlert())
    }
    dispatch(clear())
}

