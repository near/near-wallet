export class WalletError extends Error {
    constructor(message, messageCode, data = {}) {
        super(message)
        this.messageCode = `walletErrorCodes.${messageCode}`
        this.data = data
    }
}
