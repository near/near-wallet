import { wallet } from '../utils/wallet';

class FungibleTokens {
    constructor() {
        this.account = wallet.getAccountBasic();
    }

    async checkStorageBalance(contractName, accountId) {
        return await this.account.viewFunction(contractName, 'storage_balance_of', { account_id: accountId }).catch(logError);
    }
}

const logError = (error) => {
    console.warn(error);
    Sentry.captureException(error);
};

export const fungibleTokens = new FungibleTokens();
