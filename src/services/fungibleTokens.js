import { wallet } from '../utils/wallet';

class FungibleTokens {
    constructor() {
        this.account = wallet.getAccountBasic();
    }
}

export const fungibleTokens = new FungibleTokens();
