import { createStore } from 'redux';

import history from './history';
import createRootReducer from './redux/combineReducers';
import createMiddleware from './redux/middleware';

export default createStore(createRootReducer(history), createMiddleware(history));
