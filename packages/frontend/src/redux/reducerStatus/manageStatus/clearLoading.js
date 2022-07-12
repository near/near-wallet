import set from 'lodash.set';

export default (buildStatusPath) => 
    (state, action) => 
        set(state, [...buildStatusPath(action), 'status', 'loading'], false);
