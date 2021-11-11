const { BN } = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");

module.exports = {
    WALLET_NETWORK: {
        MAINNET: "mainnet",
        TESTNET: "testnet",
        BETANET: "betanet",
    },
    CONTRACT_WASM_URLS: {
        LINKDROP: "https://github.com/near/near-linkdrop/raw/63a4d0c4acbc2ffcf865be2b270c900bea765782/res/linkdrop.wasm",
        LOCKUP: "https://github.com/near/core-contracts/raw/master/lockup/res/lockup_contract.wasm",
        LOCKUP_V2: "https://github.com/near/core-contracts/raw/2691bd68a284cf519c1dd1927eb03be6fdd7a44b/lockup/res/lockup_contract.wasm"
    },
    LINKDROP_ACCESS_KEY_ALLOWANCE: new BN(parseNearAmount("1.0"))
};
