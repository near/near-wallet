import set from 'lodash.set';

export default (buildStatusPath, loading) => 
    (state, action) => 
        set(state, [...buildStatusPath(action), 'status', 'loading'], loading);
