import { combineReducers } from 'redux';

import combinedMainReducers from './combinedMainReducers';
import setupAccountReducer from './setupAccountReducer';

export default (history) => combineReducers({
    ...combinedMainReducers(history),
    ...setupAccountReducer(history)
});
