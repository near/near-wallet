import { handleActions, combineActions } from 'redux-actions'
import {
   REFRESH_ACCOUNT,
   LOADER_ACCOUNT,
   REFRESH_URL,
   requestCode,
   validateCode,
   getAccountDetails
} from '../actions/account'
import reduceReducers from 'reduce-reducers'

const initialState = {
   formLoader: false,
   sentSms: false
}

const loaderReducer = (state, { ready }) => {
   if (typeof ready === 'undefined') {
      return state
   }
   return { ...state, formLoader: !ready }
}

const requestResultReducer = handleActions(
   {
      [combineActions(requestCode, validateCode)]: (
         state,
         { error, payload, meta }
      ) => ({
         ...state,
         requestStatus:
            !!payload || error
               ? {
                    success: !error,
                    messageCode: error
                       ? payload.messageCode || meta.errorCode
                       : meta.successCode
                 }
               : undefined
      })
   },
   initialState
)

const reducer = handleActions(
   {
      [requestCode]: (state, { error, ready }) => {
         if (ready && !error) {
            return { ...state, sentSms: true }
         }
         return state
      }
   },
   initialState
)

const authorizedApps = handleActions(
   {
      [getAccountDetails]: (state, { error, payload }) => ({
         ...state,
         authorizedApps: payload && payload.authorizedApps
      })
   },
   initialState
)

// TODO: Migrate everything to redux-actions
function account(state = {}, action) {
   switch (action.type) {
      case REFRESH_ACCOUNT:
         return {
            ...state,
            ...action.data
         }
      case LOADER_ACCOUNT: {
         return {
            ...state,
            loader: action.loader
         }
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

export default reduceReducers(
   initialState,
   loaderReducer,
   requestResultReducer,
   reducer,
   authorizedApps,
   account
)
