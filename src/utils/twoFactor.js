import * as nearApiJs from 'near-api-js'
import { store } from '..'
import { WalletError } from './walletError'
import { promptTwoFactor } from '../actions/account'
import { MULTISIG_MIN_AMOUNT } from './wallet'
import { utils } from 'near-api-js'
import { BN } from 'bn.js'

export const MULTISIG_CONTRACT_HASHES = process.env.MULTISIG_CONTRACT_HASHES || [
    // https://github.com/near/core-contracts/blob/fa3e2c6819ef790fdb1ec9eed6b4104cd13eb4b7/multisig/src/lib.rs
    '7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk',
    // https://github.com/near/core-contracts/blob/fb595e6ec09014d392e9874c2c5d6bbc910362c7/multisig/src/lib.rs
    'AEE3vt6S3pS2s7K6HXnZc46VyMyJcjygSMsaafFh67DF',
    // https://github.com/near/core-contracts/blob/636e7e43f1205f4d81431fad0be39c5cb65455f1/multisig/src/lib.rs
    '8DKTSceSbxVgh4ANXwqmRqGyPWCuZAR1fCqGPXUjD5nZ',
    // https://github.com/near/core-contracts/blob/f93c146d87a779a2063a30d2c1567701306fcae4/multisig/res/multisig.wasm
    '55E7imniT2uuYrECn17qJAk9fLcwQW4ftNSwmCJL5Di',
];

const { 
    multisig: { AccountMultisig, MULTISIG_CHANGE_METHODS },
    transactions: { deleteKey, addKey, functionCallAccessKey, deployContract },
    utils: { key_pair: { PublicKey } }
} = nearApiJs

export class TwoFactor extends AccountMultisig {
    constructor(wallet) {
        super(wallet.connection, wallet.accountId, localStorage)
        this.wallet = wallet

        // debugging disable

        window.twoFactor = this
    }

    async isEnabled(accountId) {
        const accessKeys = await this.wallet.getAccessKeys()
        const seedPhraseKeys = (await this.getRecoveryMethods()).data
            .filter(({ kind, publicKey }) => kind === 'phrase' && publicKey !== null && accountKeys.includes(publicKey))
            .map((rm) => rm.publicKey)
        console.log(seedPhraseKeys)
        const isDisabled = accessKeys.filter((k) => !seedPhraseKeys.includes(k))
            .some(({ access_key }) => access_key.permission && access_key.permission === 'FullAccess')
        console.log('isDisabled', isDisabled)
        if (isDisabled || !accountId.length || this.accountId !== accountId) {
            return false
        }
        return MULTISIG_CONTRACT_HASHES.includes((await this.state()).code_hash)
    }

    async get2faMethod() {
        if (this.wallet.has2fa) {
            return super.get2faMethod()
        }
        return null
    }

    async checkCanEnableTwoFactor(account) {
        const availableBalance = new BN(account.balance.available)
        const multisigMinAmount = new BN(utils.format.parseNearAmount(MULTISIG_MIN_AMOUNT))
        return multisigMinAmount.lt(availableBalance)
    }

    async initTwoFactor(accountId, method) {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        this.setRequest({ requestId: -1 })
        return await this.wallet.postSignedJson('/2fa/init', {
            accountId,
            method
        });
    }

    async reInitTwoFactor(accountId, method) {
        // clear any previous requests in localStorage (for verifyTwoFactor)
        this.setRequest({ requestId: -1 })
        return this.sendRequest(accountId, method)
    }

    async resend(accountId, method) {
        if (!accountId) accountId = this.wallet.accountId
        if (!method) method = await this.get2faMethod()
        const requestData = this.getRequest()
        let { requestId } = requestData
        if (!requestId && requestId !== 0) {
            requestId = -1
        }
        return this.sendRequest(accountId, method, requestId)
    }

    async verifyTwoFactor(securityCode) {
        return this.verifyRequestCode(securityCode)
    }

    // override for custom UX
    async signAndSendTransaction(receiverId, actions) {
        let requestId = -1
        try {
            await super.signAndSendTransaction(receiverId, actions)
            requestId = await this.sendRequestCode()
        } catch (e) {
            console.log(e)
            throw new WalletError('error creating request')
        }
        if (requestId !== -1 && !store.getState().account.requestPending) {
            try {
                return await store.dispatch(promptTwoFactor(true)).payload.promise
            } catch (e) {
                if (e.message.indexOf('not valid') > -1) {
                    throw new WalletError(e.message, 'errors.twoFactor.invalidCode')
                }
                throw e
            }
        }
    }

    // TODO deprecate or test this (we removed the send new recovery message option)
    async rotateKeys(account, addPublicKey, removePublicKey) {
        const { accountId } = account
        const actions = [
            addKey(addPublicKey),
            deleteKey(removePublicKey)
        ]
        return await this.signAndSendTransaction(accountId, actions)
    }

    async deployMultisig() {
        const contractBytes = new Uint8Array(await (await fetch('/multisig.wasm')).arrayBuffer())
        return super.deployMultisig(contractBytes)
    }

    async disable() {
        const { accountId } = this
        const accessKeys = await this.wallet.getAccessKeys()
        const lak2fak = accessKeys.filter(({ access_key }) => 
            access_key && access_key.permission && access_key.permission.FunctionCall &&
            access_key.permission.FunctionCall.receiver_id === accountId &&
            access_key.permission.FunctionCall.method_names &&
            access_key.permission.FunctionCall.method_names.length === 4 &&
            access_key.permission.FunctionCall.method_names.includes('add_request_and_confirm')    
        )
        const contractBytes = new Uint8Array(await (await fetch('/main.wasm')).arrayBuffer())
        const actions = [
            ...lak2fak.map(({ public_key }) => deleteKey(public_key)),
            ...lak2fak.map(({ public_key }) => addKey(public_key)),
            deployContract(contractBytes),
        ]
        console.log('disabling 2fa for', accountId)
        return await this.signAndSendTransaction(accountId, actions)
    }

    async enable() {
        const { accountId } = this
        const accountKeys = (await this.getAccessKeys()).map((ak) => ak.public_key)
        const seedPhraseKeys = (await this.getRecoveryMethods()).data
            .filter(({ kind, publicKey }) => kind === 'phrase' && publicKey !== null && accountKeys.includes(publicKey))
            .map((rm) => rm.publicKey)
        const confirmOnlyKey = (await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey
        const fak2lak = accountKeys.filter((k) => !seedPhraseKeys.includes(k) && !confirmOnlyKey.includes(k))
            .map((k) => PublicKey.from(k))
        const contractBytes = new Uint8Array(await (await fetch('/multisig.wasm')).arrayBuffer())
        const actions = [
            ...fak2lak.map((k) => deleteKey(k)),
            ...fak2lak.map((k) => addKey(k, functionCallAccessKey(accountId, MULTISIG_CHANGE_METHODS, null))),
            deployContract(contractBytes),
        ]
        console.log('enabling 2fa for', accountId, actions)
        const account = this.wallet.getAccount()
        account.accountId = accountId
        return await account.signAndSendTransaction(accountId, actions);
    }
}