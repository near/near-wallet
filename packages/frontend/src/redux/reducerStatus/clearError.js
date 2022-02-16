import set from 'lodash.set';

import initialErrorState from './initialErrorState';

export default (buildStatusPath) => 
    (state, action) => 
        set(state, [...buildStatusPath(action), 'status', 'error'], initialErrorState);
