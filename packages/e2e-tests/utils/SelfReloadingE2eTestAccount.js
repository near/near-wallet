const { Connection, InMemorySigner, Account } = require("near-api-js");
const assert = require("assert");

const { WALLET_NETWORK } = require("../constants");
const E2eTestAccount = require("./E2eTestAccount");
const nearApiJsConnection = require("./connectionSingleton");
const SelfReloadingJSONRpcProvider = require("./SelfReloadingJSONRpcProvider");

class SelfReloadingE2eTestAccount extends E2eTestAccount {
    constructor(...args) {
        const config = nearApiJsConnection.config;
        assert(
            config.networkId === WALLET_NETWORK.TESTNET,
            "cannot instantiate non testnet instance of SelfReloadingE2eTestAccount"
        );
        super(...args);
    }
    async connectToNearApiJs() {
        const config = nearApiJsConnection.config;
        this.nearApiJsAccount = new Account(
            new Connection(
                config.networkId,
                new SelfReloadingJSONRpcProvider(config.nodeUrl),
                new InMemorySigner(config.keyStore)
            ),
            this.accountId
        );
        await this.nearApiJsAccount.state();
    }
}

module.exports = SelfReloadingE2eTestAccount;
