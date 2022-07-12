import set from 'lodash.set';

import initialErrorState from '../initialState/initialErrorState';

export default (buildStatusPath) => 
    (state, action) => 
        set(state, [...buildStatusPath(action), 'status', 'error'], initialErrorState);
