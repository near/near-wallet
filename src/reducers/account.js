import { handleActions } from 'redux-actions'
import {
   REFRESH_ACCOUNT,
   LOADER_ACCOUNT,
   REFRESH_URL,
   requestCode,
   validateCode
} from '../actions/account'

const reducer = handleActions({
   [requestCode]: (state, { error, payload }) => {
      if (payload) {
         return { ...state, successMessage: true, sentSms: true }
      }
      if (error) {
         return { ...state, errorMessage: true }
      }
      return state
   },
   [validateCode]: (state, { error, payload }) => {
      if (payload) {
         return { ...state, successMessage: true }
      }
      if (error) {
         return { ...state, errorMessage: true }
      }
      return state
   }
}, {
   sentSms: false,
   successMessage: false,
   errorMessage: false
   // TODO: Default state doesn't work as expected?
})

// TODO: Migrate everything to redux-actions
export default function account(state = {}, action) {
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
         return reducer(state, action)
   }
}

