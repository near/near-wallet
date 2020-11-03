import thunk from 'redux-thunk'
import { applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'

import * as Sentry from '@sentry/browser'
import mixpanel from 'mixpanel-browser'
import {IS_MAINNET, NETWORK_ID, wallet} from '../utils/wallet'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const RECOVER_WITH_LINK_URL = 'recover-with-link'

/**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 */
const readyStatePromise = store => next => action => {
    if (!action.payload || !action.payload.then) {
        return next(action)
    }

    function makeAction(ready, data) {
        const newAction = Object.assign({}, action)
        delete newAction.payload
        return Object.assign(newAction, { ready }, data)
    }

    next(makeAction(false))
    return action.payload.then(
        payload => {
            next(makeAction(true, { payload }))
            return payload
        },
        error => {
            console.warn('Error in background action:', error)
            Sentry.captureException(error);
            next(makeAction(true, { error: true, payload: error }))
            throw error
        }
    )
}

if (process.env.MIXPANEL_TOKEN) {
    mixpanel.init(process.env.MIXPANEL_TOKEN, {'property_blacklist': ['$current_url']})
}

const analyticsMiddleware = store => next => action => {
    let createEvents = ['CREATE_NEW_ACCOUNT', 'CREATE_ACCOUNT_WITH_SEED_PHRASE','CHECK_ACCOUNT_AVAILABLE', 'CHECK_NEW_ACCOUNT' ]
    let twoFAEvents = ['GET_2FA_METHOD', 'INIT_TWO_FACTOR', 'VERIFY_TWO_FACTOR', 'PROMPT_TWO_FACTOR', 'RESEND_TWO_FACTOR']
    let ledgerEvents = ['GET_LEDGER_KEY', 'GET_LEDGER_PUBLIC_KEY', 'ADD_LEDGER_ACCESS_KEY', 'CONNECT_LEDGER', 'DISABLE_LEDGER',
'GET_LEDGER_ACCOUNT_IDS', 'ADD_LEDGER_ACCOUNT_ID', 'SAVE_AND_SELECT_LEDGER_ACCOUNTS']
    let accesskeyEvents = ['GET_ACCESS_KEYS', 'REMOVE_ACCESS_KEY','REMOVE_NON_LEDGER_ACCESS_KEYS', 'ADD_ACCESS_KEY', 'ADD_ACCESS_KEY_SEED_PHRASE']
    let recoveryEvents = ['DELETE_RECOVERY_METHOD', 'RECOVER_ACCOUNT_SEED_PHRASE', 'SETUP_RECOVERY_MESSAGE_NEW_ACCOUNT']
    let transactionEvents = ['DEPLOY_MULTISIG', 'CHECK_NEAR_DROP_BALANCE', 'SET_LEDGER_TX_SIGNED','SIGN_AND_SEND_TRANSACTIONS', 'SEND_MONEY', 'SWITCH_ACCOUNT']
    let stakeEvents = ['UPDATE_STAKING', 'STAKE', 'UNSTAKE','WITHDRAW']
    let trackingEvents = createEvents.concat(twoFAEvents).concat(ledgerEvents).concat(accesskeyEvents).concat(recoveryEvents).concat(transactionEvents).concat(stakeEvents)
    let details = {
        path_name: !window.location.pathname.includes(RECOVER_WITH_LINK_URL) ? 
            window.location.pathname : RECOVER_WITH_LINK_URL
    }
    let networkId = IS_MAINNET ? 'mainnet': (NETWORK_ID === 'default'? 'testnet': NETWORK_ID)
    if (process.env.MIXPANEL_TOKEN) {
        mixpanel.register({
            network_id: networkId,
            timestamp: new Date().toString(),
            account_id: wallet.accountId
        })
        let id = mixpanel.get_distinct_id();
        mixpanel.identify(id);
        mixpanel.people.set({
            network_id: networkId,
            stake: 0
        })
        if (trackingEvents.includes(action.type)){
            mixpanel.track(action.type, details);
        }
        if (action.type === 'CREATE_ACCOUNT_WITH_SEED_PHRASE'){
            mixpanel.people.set({
                recovery_method: 'seed phrase',
                account_creation_date: new Date().toString()
            })
        }
        if (action.type === 'ADD_LEDGER_ACCESS_KEY'){
            mixpanel.people.set({
                recovery_method: 'ledger',
                account_creation_date: new Date().toString()
            })
        }
        if (action.type === 'SETUP_RECOVERY_MESSAGE_NEW_ACCOUNT'){
            mixpanel.people.set({
                recovery_method: 'phone or email',
                account_creation_date: new Date().toString()
            })
        }
        if (action.type === 'RECOVER_ACCOUNT_SEED_PHRASE' || action.type === 'SAVE_AND_SELECT_LEDGER_ACCOUNTS'){
            mixpanel.people.set({
                recovery_timestamp: new Date().toString()
            })
        }
        if (action.type === 'STAKE'){
            mixpanel.people.set_once({
                first_stake: new Date().toString()
            })
            mixpanel.people.increment('stake')
        }
    }
    return next(action);
}

export default (history) => composeEnhancers(
        applyMiddleware(
                routerMiddleware(history),
                thunk,
                readyStatePromise,
                analyticsMiddleware))
