import { wallet } from '../../utils/wallet'

export default store => next => action => {
    if (typeof action === 'function') {
        const dispatch = store.dispatch
        const getStateActiveAccount = () => {
            return wallet.accountId 
                ? getState()[wallet.accountId] 
                : {}
        }
        const getState = store.getState

        // ultimately: return action(dispatch, getStateActiveAccount, getState)
        return action(dispatch, getStateActiveAccount, getState )
    }
    return next(action)
}
