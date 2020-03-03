const KEY_WALLET_URL = 'wallet:url'

export const loadState = () => {
    try {
        return JSON.parse(sessionStorage.getItem(KEY_WALLET_URL))
    } catch(err) {
        console.warn(err)
    }
}

export const saveState = (state) => {
    try {
        sessionStorage.setItem(KEY_WALLET_URL, JSON.stringify(state))
    } catch(err) {
        console.warn(err)
    }
}

export const clearState = () => {
    try {
        sessionStorage.removeItem(KEY_WALLET_URL)
    } catch(err) {
        console.warn(err)
    }
}
