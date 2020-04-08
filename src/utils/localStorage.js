import { keyAccountConfirmed } from './wallet'

export const setAccountConfirmed = (accountId, confirmed) => {
    try {
        localStorage.setItem(keyAccountConfirmed(accountId), confirmed)
    } catch (err) {
        console.warn(err)
    }
}

export const getAccountConfirmed = (accountId) => {
    try {
        return localStorage.getItem(keyAccountConfirmed(accountId)) === 'true'
    } catch (err) {
        console.warn(err)
    }
}

export const removeAccountConfirmed = (accountId) => {
    try {
        localStorage.removeItem(keyAccountConfirmed(accountId))
    } catch (err) {
        console.warn(err)
    }
}
