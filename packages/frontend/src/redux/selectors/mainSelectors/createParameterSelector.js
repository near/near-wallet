// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
export default (selector) => (_, params) => selector(params);
