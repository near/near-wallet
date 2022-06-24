export const ALL_KINDS = ['email', 'phone', 'phrase'];

export const getActiveMethods = (userRecoveryMethods) => {
    const activeMethods = userRecoveryMethods.filter(({ kind }) => ALL_KINDS.includes(kind));
    const currentActiveKinds = new Set(activeMethods.map((method) => method.kind));
    const missingKinds = ALL_KINDS.filter((kind) => !currentActiveKinds.has(kind));
    missingKinds.forEach((kind) => activeMethods.push({ kind: kind }));

    return activeMethods;
};

export const getActiveMethodsMap = (activeMethods) => {
    return activeMethods.reduce((map, method) => {
        map[method.kind] = method;

        return map;
    }, {});
};
