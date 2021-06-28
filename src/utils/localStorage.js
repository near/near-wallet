import { keyAccountConfirmed, keyStakingAccountSelected, keyAccountInactive } from './wallet'

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

export const setAccountIsInactive = (accountId) => {
    localStorage.setItem(keyAccountInactive(accountId), true)
}

export const getAccountIsInactive = (accountId) => {
    return localStorage.getItem(keyAccountInactive(accountId))
}

export const removeAccountIsInactive = (accountId) => {
    localStorage.removeItem(keyAccountInactive(accountId))
}
