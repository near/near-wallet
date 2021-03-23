import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import {
    setFlowLimitation,
    clearFlowLimitation
} from '../../actions/flowLimitation'

const initialState = {
    mainMenu: false,
    subMenu: false,
    accountPages: false,
    accountData: false
}

const flowLimitationReducer = handleActions({
}, initialState)

export default reduceReducers(
    initialState,
    flowLimitationReducer
)
