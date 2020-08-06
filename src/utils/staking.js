// import * as nearApiJs from 'near-api-js'
// import { store } from '..'

const WHITELIST = ['test-validator-1', 'test-validator-2', 'test-validator-3']

export class Staking {
    constructor(wallet) {
        this.wallet = wallet
    }

    getList() {
        return WHITELIST
    }
}