import { handleActions, combineActions } from 'redux-actions'
import {
   requestCode,
   setupAccountRecovery,
   recoverAccount,
   getAccountDetails,
   checkNewAccount,
   createNewAccount,
   checkAccountAvailable,
   clear,
   clearCode,
   addAccessKey,
   clearAlert,
   refreshAccount,
   refreshUrl,
   resetAccounts
} from '../actions/account'
import reduceReducers from 'reduce-reducers'

const initialState = {
   formLoader: false,
   sentSms: false,
   loginPending: true
}

const loginReducer = handleActions({
   [createNewAccount] : (state, { error, payload }) => ({
      ...state,
      loginError: error,
      loginErrorMessage: (error && payload && payload.toString()) || undefined,
      loginResetAccounts: false
   }),
   [refreshUrl]: (state, { payload }) => ({
      ...state,
      url: payload
   }),
   [resetAccounts]: (state) => ({
      ...state,
      loginResetAccounts: true
   }),
   [refreshAccount]: (state, { ready, error, payload, meta }) => {
      if (typeof payload === 'undefined') {
         return {
            ...state,
            loginPending: meta.loader ? !ready : false,
         }
      }

      if (error) {
         return {
            ...state,
            loginError: true,
            loginErrorMessage: payload.message,
            loginPending: false
         }
      }

      if (payload) {
         return { 
            ...state, 
            accountId: meta.accountId,
            amount: payload ? payload.amount : '0',
            stake: payload ? payload.stake : 0,
            nonce: payload ? payload.nonce : 0,
            code_hash: payload ? payload.code_hash : '',
            accounts: meta.accounts,

            loginPending: meta.loader ? !ready : false,
            loginError: false,
            loginErrorMessage: ''
         }
      }

      return state
   }
}, initialState)

const loaderReducer = (state, { ready }) => {
   if (typeof ready === 'undefined') {
      return state
   }
   return { ...state, formLoader: !ready }
}

const globalAlertReducer = handleActions({
   // TODO: Reset state before action somehow. On navigate / start of other action?
   // TODO: Make this generic to avoid listing actions
   [combineActions(addAccessKey)]: (state, { error, payload, meta }) => ({
      ...state,
      globalAlert: !!payload || error ? {
         success: !error,
         errorMessage: (error && payload && payload.toString()) || undefined,
         messageCodeHeader: error ? payload.messageCode || meta.errorCodeHeader : meta.successCodeHeader,
         messageCodeDescription: error ? payload.messageCode || meta.errorCodeDescription : meta.successCodeDescription,
      } : undefined
   }),
   [clearAlert]: state => Object.keys(state).reduce((obj, key) => key !== 'globalAlert' ? (obj[key] = state[key], obj) : obj, {})
}, initialState)

const requestResultReducer = handleActions({
   // TODO: Reset state before action somehow. On navigate / start of other action?
   // TODO: Make this generic to avoid listing actions
   [combineActions(requestCode, setupAccountRecovery, recoverAccount, checkNewAccount, createNewAccount, checkAccountAvailable)]: (state, { error, payload, meta }) => ({
      ...state,
      requestStatus: !!payload || error ? {
         success: !error,
         errorMessage: (error && payload && payload.toString()) || undefined,
         messageCode: error ? payload.messageCode || meta.errorCode : meta.successCode 
      } : undefined
   }),
   [clear]: state => Object.keys(state).reduce((obj, key) => key !== 'requestStatus' ? (obj[key] = state[key], obj) : obj, {})
}, initialState)

const reducer = handleActions({
      [requestCode]: (state, { error, ready }) => {
         if (ready && !error) {
            return { ...state, sentSms: true }
         }
         return state
      },
      [clearCode]: (state, { error, ready }) => {
         return { ...state, sentSms: false }
      }
}, initialState)

const authorizedApps = handleActions({
      [getAccountDetails]: (state, { error, payload }) => ({
         ...state,
         authorizedApps: payload && payload.authorizedApps
      })
}, initialState)

export default reduceReducers(
   initialState,
   loaderReducer,
   globalAlertReducer,
   requestResultReducer,
   reducer,
   authorizedApps,
   loginReducer
)
