const { BN } = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");

const dateNowNanosBN = new BN(Date.now()).mul(new BN("1000000"));

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
    LOCKUP_CONFIGS: {
        HALF_VESTED_CONFIG: {
            release_duration: "0",
            lockup_timestamp: dateNowNanosBN.sub(new BN("60").mul(new BN("60000000000"))).toString(), // 1 hour ago
            vesting_schedule: {
                VestingSchedule: {
                    start_timestamp: dateNowNanosBN.sub(new BN("525600").mul(new BN("60000000000"))).toString(), // 1 year ago
                    end_timestamp: dateNowNanosBN.add(new BN("525600").mul(new BN("60000000000"))).toString(), // 1 year from now
                    cliff_timestamp: dateNowNanosBN.toString(), // now
                },
            },
        },
        FULLY_UNVESTED_CONFIG: {
            release_duration: "0",
            lockup_timestamp: dateNowNanosBN.sub(new BN("60").mul(new BN("60000000000"))).toString(), // 1 hour ago
            vesting_schedule: {
                VestingSchedule: {
                    start_timestamp: dateNowNanosBN.toString(), // now
                    end_timestamp: dateNowNanosBN.add(new BN("1051200").mul(new BN("60000000000"))).toString(), // 2 years from now
                    cliff_timestamp: dateNowNanosBN.add(new BN("525600").mul(new BN("60000000000"))).toString(), // 1 year from now
                },
            },
        },
        FULLY_VESTED_CONFIG: {
            release_duration: "0",
            lockup_timestamp: dateNowNanosBN.sub(new BN("60").mul(new BN("60000000000"))).toString(), // 1 hour ago
            vesting_schedule: {
                VestingSchedule: {
                    start_timestamp: dateNowNanosBN.sub(new BN("535600").mul(new BN("60000000000"))).toString(), // 1 year ago
                    end_timestamp: dateNowNanosBN.sub(new BN("60").mul(new BN("60000000000"))).toString(), // 1 hour ago
                    cliff_timestamp: dateNowNanosBN.sub(new BN("1051200").mul(new BN("60000000000"))).toString(), // 2 years ago
                },
            },
        },
    },
    LINKDROP_ACCESS_KEY_ALLOWANCE: new BN(parseNearAmount("1.0")),
};
