const SLICE_NAME = 'transactions';

// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
function createParameterSelector(selector) {
    return (_, params) => selector(params);
}
