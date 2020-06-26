export class WalletError extends Error {
    constructor(message, messageCode, data = {}) {
        super(message)
        this.messageCode = messageCode
        this.data = data
    }
}
