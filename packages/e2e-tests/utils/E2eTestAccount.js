const {
    transactions: {
        functionCall
    },
    utils: {
        format: { parseNearAmount },
    },
} = require("near-api-js");

const BN = require("bn.js");
const { walletNetwork } = require("./config");
const nearApiJsConnection = require("./connectionSingleton");
const { getKeyPairFromSeedPhrase, generateTestAccountId } = require("./helpers");

const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
const FT_WRAPPING_GAS = parseNearAmount('0.00000000003');

class E2eTestAccount {
    constructor(accountId, seedPhrase, parentNearApiJsAccount) {
        this.accountId = accountId;
        this.seedPhrase = seedPhrase;
        this.parentNearApiJsAccount = parentNearApiJsAccount;
        this.isCreated = false;
    }
    async initialize() {
        await nearApiJsConnection.setKeyPairFromSeedPhrase({ accountId: this.accountId, seedPhrase: this.seedPhrase });
        await this.connectToNearApiJs();
        return this;
    }
    async connectToNearApiJs() {
        const near = await nearApiJsConnection.getConnection();
        this.nearApiJsAccount = await near.account(this.accountId);
    }
    async create({ amount, contractWasm } = { amount: "1.0" }) {
        if (contractWasm) {
            await this.parentNearApiJsAccount.createAndDeployContract(
                this.accountId,
                getKeyPairFromSeedPhrase(this.seedPhrase).publicKey,
                contractWasm,
                parseNearAmount(amount)
            );
        } else {
            await this.parentNearApiJsAccount.createAccount(
                this.accountId,
                getKeyPairFromSeedPhrase(this.seedPhrase).publicKey,
                parseNearAmount(amount)
            );
        }
        this.isCreated = true;
        return this.initialize();
    }
    spawnRandomSubAccountInstance() {
        if (!this.nearApiJsAccount) {
            throw new Error("Account needs to be initialized to spawn sub accounts");
        }
        const randomSubaccountId = `${generateTestAccountId()}.${this.accountId}`;
        const randomSubaccountSeedphrase = `${randomSubaccountId} ${process.env.TEST_ACCOUNT_SEED_PHRASE}`;
        return new E2eTestAccount(randomSubaccountId, randomSubaccountSeedphrase, this.nearApiJsAccount);
    }
    async delete() {
        if (this.isCreated) {
            // this will not allow deletion of existing accounts connected to from here, only created accounts
            await this.nearApiJsAccount.deleteAccount(this.parentNearApiJsAccount.accountId);
        }
    }
    async getUpdatedBalance() {
        await this.connectToNearApiJs();
        return this.nearApiJsAccount.getAccountBalance();
    }
    async getAmountStakedWithValidator(validatorAccountId) {
        const balanceString = await this.nearApiJsAccount.viewFunction(validatorAccountId, "get_account_staked_balance", {
            account_id: this.accountId,
        });
        return new BN(balanceString);
    }
    async getFungibleTokenBalance(contractName) {
        return this.nearApiJsAccount.viewFunction(contractName, 'ft_balance_of', { account_id: this.accountId });
    }
    async wrapNear(amount) {

        const contractName = `wrap.${walletNetwork}`;
        const actions = [
            functionCall(
                "storage_deposit", // method to create an account
                {
                    registration_only: true,
                },
                FT_STORAGE_DEPOSIT_GAS, // attached gas
                FT_MINIMUM_STORAGE_BALANCE)
            ,
            functionCall(
                "near_deposit",
                {},
                FT_WRAPPING_GAS,
                amount
            ),
        ];

        return this.nearApiJsAccount.signAndSendTransaction({
            receiverId: contractName,
            actions,
        });
    }
}

module.exports = E2eTestAccount;
