import { handleActions, combineActions } from 'redux-actions'
import {
   REFRESH_ACCOUNT,
   LOADER_ACCOUNT,
   REFRESH_URL,
   requestCode,
   validateCode
} from '../actions/account'
import reduceReducers from 'reduce-reducers';

const initialState = {
   formLoader: false,
   sentSms: false,
   successMessage: false,
   errorMessage: false
}

const loaderReducer = (state, { ready }) => {
   if (typeof ready === 'undefined') {
      return state
   }
   return { ...state, formLoader: !ready }
}

const requestResultReducer = handleActions({
   [combineActions(requestCode, validateCode)]: (state, { error, payload }) => {
      return { ...state, successMessage: !!payload, errorMessage: !!error}
   }
}, initialState)

const reducer = handleActions({
   [requestCode]: (state, { payload }) => {
      if (payload) {
         return { ...state, sentSms: true }
      }
      return state
   },
}, initialState)

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
   account)

