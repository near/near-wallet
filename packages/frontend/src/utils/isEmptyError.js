export function isEmptyError(error) {
    if (!error) {
        return true;
    }

    if (typeof error === 'object' && (error.message || error.code)) {
        return false;
    }

    return true;
}

export function isRealError(error) {
    return !isEmptyError(error);
}
