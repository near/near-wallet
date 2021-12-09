import * as nearApiJs from "near-api-js";

import Environments from "../../../../../features/environments.json";

export default {
    NEAR_WALLET_ENV: Environments.TESTNET_STAGING,
    ACCOUNT_HELPER_URL:
        process.env.REACT_APP_ACCOUNT_HELPER_URL ||
        "https://near-contract-helper.onrender.com",
    ACCOUNT_ID_SUFFIX: process.env.REACT_APP_ACCOUNT_ID_SUFFIX || "testnet",
    ACCESS_KEY_FUNDING_AMOUNT:
        process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT ||
        nearApiJs.utils.format.parseNearAmount("0.25"),
    BROWSER_MIXPANEL_TOKEN: process.env.BROWSER_MIXPANEL_TOKEN,
    DISABLE_CREATE_ACCOUNT:
        process.env.DISABLE_CREATE_ACCOUNT === "true" ||
        process.env.DISABLE_CREATE_ACCOUNT === "yes",
    DISABLE_PHONE_RECOVERY: process.env.DISABLE_PHONE_RECOVERY === "yes",
    EXPLORE_APPS_URL:
        process.env.EXPLORE_APPS_URL || "https://awesomenear.com/trending/",
    EXPLORE_DEFI_URL:
        process.env.EXPLORE_DEFI_URL ||
        "https://awesomenear.com/categories/defi/",
    EXPLORER_URL:
        process.env.EXPLORER_URL || "https://explorer.testnet.near.org",
    HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL:
        process.env.HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL,
    IS_MAINNET: [Environments.MAINNET, Environments.MAINNET_STAGING].some(
        (env) => env === process.env.NEAR_WALLET_ENV
    ),
    LINKDROP_GAS: process.env.LINKDROP_GAS || "100000000000000",
    LOCKUP_ACCOUNT_ID_SUFFIX:
        process.env.LOCKUP_ACCOUNT_ID_SUFFIX || "lockup.near",
    MIN_BALANCE_FOR_GAS:
        process.env.REACT_APP_MIN_BALANCE_FOR_GAS ||
        nearApiJs.utils.format.parseNearAmount("0.05"),
    MIN_BALANCE_TO_CREATE:
        process.env.MIN_BALANCE_TO_CREATE ||
        nearApiJs.utils.format.parseNearAmount("0.1"),
    MOONPAY_API_KEY:
        process.env.MOONPAY_API_KEY ||
        "pk_test_wQDTsWBsvUm7cPiz9XowdtNeL5xasP9",
    MOONPAY_API_URL: process.env.MOONPAY_API_URL || "https://api.moonpay.com",
    MOONPAY_BUY_URL:
        process.env.MOONPAY_BUY_URL || "https://buy.moonpay.io?apiKey=",
    MULTISIG_CONTRACT_HASHES: process.env.MULTISIG_CONTRACT_HASHES || [
        // https://github.com/near/core-contracts/blob/fa3e2c6819ef790fdb1ec9eed6b4104cd13eb4b7/multisig/src/lib.rs
        "7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk",
        // https://github.com/near/core-contracts/blob/fb595e6ec09014d392e9874c2c5d6bbc910362c7/multisig/src/lib.rs
        "AEE3vt6S3pS2s7K6HXnZc46VyMyJcjygSMsaafFh67DF",
        // https://github.com/near/core-contracts/blob/636e7e43f1205f4d81431fad0be39c5cb65455f1/multisig/src/lib.rs
        "8DKTSceSbxVgh4ANXwqmRqGyPWCuZAR1fCqGPXUjD5nZ",
        // https://github.com/near/core-contracts/blob/f93c146d87a779a2063a30d2c1567701306fcae4/multisig/res/multisig.wasm
        "55E7imniT2uuYrECn17qJAk9fLcwQW4ftNSwmCJL5Di",
    ],
    MULTISIG_MIN_AMOUNT: process.env.REACT_APP_MULTISIG_MIN_AMOUNT || "4",
    MULTISIG_MIN_PROMPT_AMOUNT:
        process.env.REACT_APP_MULTISIG_MIN_PROMPT_AMOUNT || "200",
    NETWORK_ID: process.env.REACT_APP_NETWORK_ID || "default",
    NODE_URL: process.env.REACT_APP_NODE_URL || "https://rpc.nearprotocol.com",
    PUBLIC_URL: process.env.PUBLIC_URL,
    REACT_APP_USE_TESTINGLOCKUP: process.env.REACT_APP_USE_TESTINGLOCKUP,
    RECAPTCHA_CHALLENGE_API_KEY: process.env.RECAPTCHA_CHALLENGE_API_KEY,
    RECAPTCHA_ENTERPRISE_SITE_KEY: process.env.RECAPTCHA_ENTERPRISE_SITE_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE:
        process.env.SENTRY_RELEASE ||
        (process.env.RENDER &&
            `render:${process.env.RENDER_SERVICE_NAME}:${process.env.RENDER_GIT_BRANCH}:${process.env.RENDER_GIT_COMMIT}`) ||
        "development",
    SHOW_PRERELEASE_WARNING:
        process.env.SHOW_PRERELEASE_WARNING === "true" ||
        process.env.SHOW_PRERELEASE_WARNING === "yes",
    SMS_BLACKLIST: process.env.SMS_BLACKLIST,
    STAKING_GAS_BASE:
        process.env.REACT_APP_STAKING_GAS_BASE || "25000000000000", // 25 Tgas
    WHITELISTED_CONTRACTS: (
        process.env.TOKEN_CONTRACTS ||
        "berryclub.ek.near,farm.berryclub.ek.near,wrap.near"
    ).split(","),
};
