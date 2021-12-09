import assert from "assert";

import Environments from "../../../../features/environments.json";
import development from "./environmentDefaults/development";
import mainnet from "./environmentDefaults/mainnet";
import mainnet_STAGING from "./environmentDefaults/mainnet_STAGING";
import testnet from "./environmentDefaults/testnet";
import testnet_STAGING from "./environmentDefaults/testnet_STAGING";

const NEAR_WALLET_ENV = process.env.NEAR_WALLET_ENV;

assert(
    Object.values(Environments).some((env) => NEAR_WALLET_ENV === env),
    `Invalid environment: "${NEAR_WALLET_ENV}"`
);

const defaults = {
    [Environments.DEVELOPMENT]: development,
    [Environments.TESTNET]: testnet,
    [Environments.TESTNET_STAGING]: testnet_STAGING,
    [Environments.MAINNET]: mainnet,
    [Environments.MAINNET_STAGING]: mainnet_STAGING,
};

module.exports = defaults[NEAR_WALLET_ENV];
