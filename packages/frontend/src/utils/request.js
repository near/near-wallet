export const retryRequestIfFailed = async (callback, { attempts = 1, delay = 100 }) => {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await callback();
        } catch (error) {
            console.warn(error);
            await new Promise((res) => setTimeout(res, delay));
        }
    }

    return;
};
