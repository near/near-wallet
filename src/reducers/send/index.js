import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';

const initialState = {
    items: []
}

const sendReducer = handleActions({
}, initialState)

export default reduceReducers(
    initialState,
    sendReducer
);
