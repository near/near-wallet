import { createActions } from 'redux-actions'
import { showAlert, dispatchWithAlert } from '../utils/alerts'

export const { clear, clearAlert, showCustomAlert } = createActions({
    CLEAR: null,
    CLEAR_ALERT: null,
    SHOW_CUSTOM_ALERT: [
        (payload) => (payload),
        (meta) => showAlert(meta)
    ]
})
