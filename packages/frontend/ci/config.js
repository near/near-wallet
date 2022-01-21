const { defaults } = require("lodash");

const Environments = require("../../../features/environments.json");
const environmentConfig = require("./configFromEnvironment");

const envDefaults = {
    [Environments.DEVELOPMENT]: {
        CLOUDFLARE_BASE_URL: "https://content.near-wallet.workers.dev",
        SENTRY_RELEASE: "development",
    },
    [Environments.TESTNET]: {
        CLOUDFLARE_BASE_URL: "https://content.near-wallet.workers.dev",
    },
    [Environments.MAINNET]: {
        CLOUDFLARE_BASE_URL: "https://content.near-wallet.workers.dev",
    },
    [Environments.MAINNET_STAGING]: {
        CLOUDFLARE_BASE_URL: "https://content.near-wallet.workers.dev",
    },
};

module.exports = defaults(
    environmentConfig,
    envDefaults[environmentConfig.NEAR_WALLET_ENV]
);
