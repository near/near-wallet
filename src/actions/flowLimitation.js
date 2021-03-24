import { createActions } from 'redux-actions'

import {
    WALLET_LOGIN_URL,
    WALLET_SIGN_URL
} from '../utils/wallet'

export const handleflowLimitation = () => (dispatch, getState) => {
    const { pathname } = getState().router.location
    const { redirect_url } = getState().account.url

    const redirectUrl = redirect_url || pathname

    if (redirectUrl.includes(WALLET_LOGIN_URL)) {
        dispatch(setFlowLimitation({
            mainMenu: true,
            subMenu: false,
            accountPages: false,
            accountData: true,
            accountBalance: true
        }))
    } 
    else if (redirectUrl.includes(WALLET_SIGN_URL)) {
        dispatch(setFlowLimitation({
            mainMenu: true,
            subMenu: true,
            accountPages: true,
            accountData: true,
            accountBalance: false
        }))
    }
}

export const { 
    setFlowLimitation, 
    clearFlowLimitation
} = createActions({
    SET_FLOW_LIMITATION: null,
    CLEAR_FLOW_LIMITATION: null
})
