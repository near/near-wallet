import set from 'lodash.set';

export default (buildStatusPath) => 
    (state, action) =>  
        set(state, [...buildStatusPath(action), 'status', 'error'], {
            message: action.error?.message || 'An error was encountered.',
            code: action.error?.code
        });
