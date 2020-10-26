import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

const initialState = {
}
const alertReducer = (state, { error, ready, payload, meta, type }) => {


    return {
        ...state,
        globalAlert: {
            ...state.globalAlert,
            [type]: meta?.alert?.showAlert
                ? {
                    show: ready,
                }
                : undefined
        },
    }
}
export default reduceReducers(
    initialState,
    alertReducer,
)
