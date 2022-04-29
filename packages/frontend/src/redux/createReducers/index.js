import { combineReducers } from 'redux';

import combinedMainReducers from './combinedMainReducers';
import setupAccountReducer from './setupAccountReducer';

export default (history, accountId) => combineReducers({
    ...combinedMainReducers(history),
    ...setupAccountReducer(accountId)
});
