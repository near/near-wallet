

import { createActions } from 'redux-actions'

const defaultCodesFor = (prefix, data) => ({ successCode: `${prefix}.success`, errorCode: `${prefix}.error`, prefix, data})

export const {
    getValidators
} = createActions({
    GET_VALIDATORS: [
        wallet.staking.getValidators.bind(wallet.staking),
        () => defaultCodesFor('staking.getValidators')
    ],
})
