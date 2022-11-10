import CONFIG from '../../config';

export async function fetchBlacklistedTokens() {
    if (!CONFIG.TOKEN_BLACKLIST_ENDPOINT) {
        return [];
    }

    try {
        return fetch(CONFIG.TOKEN_BLACKLIST_ENDPOINT).then((res) => res.json());
    } catch (error) {
        console.error('Error on fetching blacklisted tokens', error);
    }

    return [];
};
