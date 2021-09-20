const { BN } = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");

module.exports = {
    WALLET_NETWORK: {
        MAINNET: "mainnet",
        TESTNET: "testnet",
        BETANET: "betanet",
    },
    CONTRACT_WASM_URLS: {
        LINKDROP: "https://github.com/near/near-linkdrop/raw/63a4d0c4acbc2ffcf865be2b270c900bea765782/res/linkdrop.wasm"
    },
    LINKDROP_ACCESS_KEY_ALLOWANCE: new BN(parseNearAmount("1.0"))
};
