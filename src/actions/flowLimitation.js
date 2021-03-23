import { createActions } from 'redux-actions'

export const { 
    setFlowLimitation, 
    clearFlowLimitation
} = createActions({
    SET_FLOW_LIMITATION: null,
    CLEAR_FLOW_LIMITATION: null
})
