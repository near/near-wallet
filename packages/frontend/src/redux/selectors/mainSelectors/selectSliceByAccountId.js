import { createSelector } from 'reselect';

import selectAccountState from './selectAccountState';

export default (sliceName, initialState) => createSelector(selectAccountState, (accountState) => accountState[sliceName] || initialState);
