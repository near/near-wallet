import { handleActions, combineActions } from 'redux-actions'
import {
   REFRESH_ACCOUNT,
   REFRESH_URL,
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
   loginPending,
   loginSuccess,
   loginError
} from '../actions/account'
import reduceReducers from 'reduce-reducers'

const initialState = {
   formLoader: false,
   sentSms: false,
   loginPending: true
}

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

// TODO: Migrate everything to redux-actions
function account(state = {}, action) {
   switch (action.type) {
      case REFRESH_ACCOUNT:
         return {
            ...state,
            ...action.data
         }
      case REFRESH_URL: {
         return {
            ...state,
            url: action.url
         }
      }
      default:
         return state
   }
}

const loginStatus = handleActions({
   [loginPending]: (state, { payload }) => ({ ...state, loginPending: payload }),
   [loginSuccess]: (state, { payload }) => ({ ...state, loginSuccess: payload }),
   [loginError]: (state, { payload }) => ({ ...state, loginError: payload })
}, initialState)

export default reduceReducers(
   initialState,
   loaderReducer,
   globalAlertReducer,
   requestResultReducer,
   reducer,
   authorizedApps,
   account,
   loginStatus
)
