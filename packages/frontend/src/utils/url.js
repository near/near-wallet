export const buildUrlOptParam = (url, params = {}) => {
    const keys = Object.keys(params);
    if (!keys.length) {
        return url;
    }

    return keys.reduce((fullUrl, key) => {
        if (params[key]) {
            fullUrl += `${key}=${params[key]}`;

            return fullUrl;
        }

        return fullUrl;
    }, `${url}?`);
};
