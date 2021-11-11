const {
    utils: {
        format: { parseNearAmount },
    },
    transactions,
} = require("near-api-js");
const BN = require("bn.js");

const nearApiJsConnection = require("./connectionSingleton");
const { getKeyPairFromSeedPhrase, generateTestAccountId } = require("./helpers");
const { getTestAccountSeedPhrase } = require("./helpers");
const { fetchLockupContract } = require("../contracts");
const { PublicKey } = require("near-api-js/lib/utils");
const { createAccount, transfer, addKey, deployContract, functionCall, fullAccessKey } = transactions;

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
        await this.nearApiJsAccount.state();
    }
    async create({ amount, contractWasm, initArgs, initFunction } = { amount: "1.0" }) {
        if (contractWasm) {
            if (initFunction && initArgs) {
                const accessKey = fullAccessKey();
                await this.parentNearApiJsAccount.signAndSendTransaction(this.accountId, [
                    createAccount(),
                    transfer(parseNearAmount(amount)),
                    addKey(PublicKey.from(getKeyPairFromSeedPhrase(this.seedPhrase).publicKey), accessKey),
                    deployContract(contractWasm),
                    functionCall(initFunction, initArgs, new BN("30000000000000")),
                ]);
            } else {
                await this.parentNearApiJsAccount.createAndDeployContract(
                    this.accountId,
                    getKeyPairFromSeedPhrase(this.seedPhrase).publicKey,
                    contractWasm,
                    parseNearAmount(amount)
                );
            }
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
    // fully unlocked / vested by default
    async createTestLockupSubAccountInstance({ amount, release_duration, lockup_timestamp, vesting_schedule, v2Wasm } = {}) {
        if (!this.nearApiJsAccount) {
            throw new Error("Account needs to be initialized to spawn sub accounts");
        }
        // creates a testinglockup subaccount with a lockup_timestamp (locked until) in 1 minute with a release_duration (period to linearly unlock) of 1 minute
        const lockupSubaccountId = `testinglockup.${this.accountId}`;
        const lockupSubaccountSeedphrase = `${lockupSubaccountId} ${process.env.TEST_ACCOUNT_SEED_PHRASE}`;
        const lockupWasm = await fetchLockupContract({ v2Wasm });
        let minuteInNanosBN = new BN("1").mul(new BN("60000000000"));

        return new E2eTestAccount(lockupSubaccountId, lockupSubaccountSeedphrase, this.nearApiJsAccount).create({
            amount: amount || "5.0",
            contractWasm: lockupWasm,
            initFunction: "new",
            initArgs: {
                owner_account_id: this.accountId,
                vesting_schedule: vesting_schedule || null,
                lockup_duration: "0",
                lockup_timestamp: lockup_timestamp || new BN(Date.now()).mul(new BN("1000000")).sub(minuteInNanosBN).toString(),
                transfers_information: {
                    TransfersEnabled: {
                        transfers_timestamp: new BN(Date.now()).mul(new BN("1000000")).sub(minuteInNanosBN).toString(),
                    },
                },
                release_duration: release_duration || minuteInNanosBN.toString(),
                staking_pool_whitelist_account_id: "whitelist.f863973.m0",
                foundation_account_id: vesting_schedule ? this.accountId : null,
            },
        });
    }
    connectOrCreate(...creationArgs) {
        return this.initialize().catch((e) => {
            if (new RegExp(`${this.accountId} does not exist while viewing`).test(e.message)) {
                return this.create(...creationArgs);
            } else {
                throw e;
            }
        });
    }
    spawnRandomSubAccountInstance() {
        if (!this.nearApiJsAccount) {
            throw new Error("Account needs to be initialized to spawn sub accounts");
        }
        const randomSubaccountId = `${generateTestAccountId()}.${this.accountId}`;
        const randomSubaccountSeedphrase = getTestAccountSeedPhrase(randomSubaccountId);
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
}

module.exports = E2eTestAccount;
