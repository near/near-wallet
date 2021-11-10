const {
    connect,
    keyStores: { InMemoryKeyStore },
} = require("near-api-js");

const { getKeyPairFromSeedPhrase } = require("./helpers");
const { walletNetwork } = require("./config");

class NearAPIJsConnection {
    static getDefaultConfig = () => ({
        networkId: walletNetwork,
        nodeUrl: process.env.NODE_URL || "https://rpc.testnet.near.org",
        walletUrl: process.env.WALLET_URL || "https://wallet.testnet.near.org",
        keyStore: new InMemoryKeyStore(),
    });

    constructor(config = NearAPIJsConnection.getDefaultConfig()) {
        if (!NearAPIJsConnection._instance) {
            this.config = config;
            NearAPIJsConnection._instance = this;
        }
        return NearAPIJsConnection._instance;
    }

    getConnection() {
        return connect(this.config);
    }

    async setKeyPair({ accountId, keyPair }) {
        await this.config.keyStore.setKey(this.config.networkId, accountId, keyPair);
    }

    async setKeyPairFromSeedPhrase({ accountId, seedPhrase }) {
        await this.config.keyStore.setKey(this.config.networkId, accountId, getKeyPairFromSeedPhrase(seedPhrase));
    }
}

module.exports = new NearAPIJsConnection();
module.exports.getDefaultConfig = NearAPIJsConnection.getDefaultConfig;
