import { wallet } from '../utils/wallet';

const FT_MINIMUM_STORAGE_BALANCE = '1250000000000000000000';

class FungibleTokens {
    constructor() {
        this.account = wallet.getAccountBasic();
    }

    async isStorageBalanceAvailable(contractName, accountId) {
        return new BN((await this.checkStorageBalance(contractName, accountId)).total).gte(new BN(FT_MINIMUM_STORAGE_BALANCE));
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
