import { keyAccountConfirmed, keyStakingAccountSelected } from './wallet'

export const setAccountConfirmed = (accountId, confirmed) => {
    localStorage.setItem(keyAccountConfirmed(accountId), confirmed)
}

export const getAccountConfirmed = (accountId) => {
    return localStorage.getItem(keyAccountConfirmed(accountId)) === 'true'
}

export const removeAccountConfirmed = (accountId) => {
    localStorage.removeItem(keyAccountConfirmed(accountId))
}

export const setStakingAccountSelected = (accountId) => {
    localStorage.setItem(keyStakingAccountSelected(), accountId)
}
export const getStakingAccountSelected = () => {
    return localStorage.getItem(keyStakingAccountSelected())
}
