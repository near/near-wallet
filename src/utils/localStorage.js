const keyAccountConfirmed = (accountId, networkId) => `wallet.account:${accountId}:${networkId}:confirmed`

export const setAccountConfirmed = (accountId, networkId, confirmed) => {
    try {
        localStorage.setItem(keyAccountConfirmed(accountId, networkId), confirmed)
    } catch (err) {
        console.warn(err)
    }
}

export const getAccountConfirmed = (accountId, networkId) => {
    try {
        return localStorage.getItem(keyAccountConfirmed(accountId, networkId)) === 'true'
    } catch (err) {
        console.warn(err)
    }
}

export const removeAccountConfirmed = (accountId, networkId) => {
    try {
        localStorage.removeItem(keyAccountConfirmed(accountId, networkId))
    } catch (err) {
        console.warn(err)
    }
}
