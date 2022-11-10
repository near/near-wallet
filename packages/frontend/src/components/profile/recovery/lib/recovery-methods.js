export const createUserRecoveryMethodsMap = (listOfMethods) =>
    Array.isArray(listOfMethods) ? listOfMethods.reduce((map, method) => {
        map[method.kind] = method;

        return map;
    }, {}) : {};
