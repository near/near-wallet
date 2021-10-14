const BN = require('bn.js');
const nearApiJs = require('near-api-js');

module.exports = {
    ACCOUNT_HELPER_URL: process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://near-contract-helper.onrender.com',
    ACCOUNT_ID_SUFFIX: process.env.REACT_APP_ACCOUNT_ID_SUFFIX || 'testnet',
    ACCESS_KEY_FUNDING_AMOUNT: process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || nearApiJs.utils.format.parseNearAmount('0.25'),
    BRANCH: process.env.BRANCH,
    BROWSER_MIXPANEL_TOKEN: process.env.BROWSER_MIXPANEL_TOKEN,
    CLOUDFLARE_BASE_URL: process.env.CLOUDFLARE_BASE_URL || 'https://content.near-wallet.workers.dev',
    CONTEXT: process.env.CONTEXT,
    DEBUG_BUILD: process.env.DEBUG_BUILD,
    DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL,
    DISABLE_CREATE_ACCOUNT: process.env.DISABLE_CREATE_ACCOUNT === 'true' || process.env.DISABLE_CREATE_ACCOUNT === 'yes',
    DISABLE_PHONE_RECOVERY: process.env.DISABLE_PHONE_RECOVERY === 'yes',
    EXPLORE_APPS_URL: process.env.EXPLORE_APPS_URL || 'https://awesomenear.com/trending/',
    EXPLORE_DEFI_URL: process.env.EXPLORE_DEFI_URL || 'https://awesomenear.com/categories/defi/',
    EXPLORER_URL: process.env.EXPLORER_URL || 'https://explorer.testnet.near.org',
    HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL: process.env.HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL,
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_MAINNET: process.env.REACT_APP_IS_MAINNET === 'true' || process.env.REACT_APP_IS_MAINNET === 'yes',
    IS_NETLIFY: process.env.NETLIFY === 'true',
    IS_RENDER: process.env.RENDER === 'true',
    IS_PULL_REQUEST: process.env.IS_PULL_REQUEST === 'true',
    LINKDROP_GAS: process.env.LINKDROP_GAS || '100000000000000',
    LOCKUP_ACCOUNT_ID_SUFFIX: process.env.LOCKUP_ACCOUNT_ID_SUFFIX || 'lockup.near',
    MIN_BALANCE_FOR_GAS: process.env.REACT_APP_MIN_BALANCE_FOR_GAS || nearApiJs.utils.format.parseNearAmount('0.05'),
    MIN_BALANCE_TO_CREATE: process.env.MIN_BALANCE_TO_CREATE || nearApiJs.utils.format.parseNearAmount('0.1'),
    MIN_LOCKUP_AMOUNT: new BN(process.env.MIN_LOCKUP_AMOUNT || nearApiJs.utils.format.parseNearAmount('35.00001')),
    MOONPAY_API_KEY: process.env.MOONPAY_API_KEY || 'pk_test_wQDTsWBsvUm7cPiz9XowdtNeL5xasP9',
    MOONPAY_API_URL: process.env.MOONPAY_API_URL || 'https://api.moonpay.com',
    MOONPAY_BUY_URL: process.env.MOONPAY_BUY_URL || 'https://buy.moonpay.io?apiKey=',
    MULTISIG_CONTRACT_HASHES: process.env.MULTISIG_CONTRACT_HASHES || [
        // https://github.com/near/core-contracts/blob/fa3e2c6819ef790fdb1ec9eed6b4104cd13eb4b7/multisig/src/lib.rs
        '7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk',
        // https://github.com/near/core-contracts/blob/fb595e6ec09014d392e9874c2c5d6bbc910362c7/multisig/src/lib.rs
        'AEE3vt6S3pS2s7K6HXnZc46VyMyJcjygSMsaafFh67DF',
        // https://github.com/near/core-contracts/blob/636e7e43f1205f4d81431fad0be39c5cb65455f1/multisig/src/lib.rs
        '8DKTSceSbxVgh4ANXwqmRqGyPWCuZAR1fCqGPXUjD5nZ',
        // https://github.com/near/core-contracts/blob/f93c146d87a779a2063a30d2c1567701306fcae4/multisig/res/multisig.wasm
        '55E7imniT2uuYrECn17qJAk9fLcwQW4ftNSwmCJL5Di',
    ],
    MULTISIG_MIN_AMOUNT: process.env.REACT_APP_MULTISIG_MIN_AMOUNT || '4',
    MULTISIG_MIN_PROMPT_AMOUNT: process.env.REACT_APP_MULTISIG_MIN_PROMPT_AMOUNT || '200',
    NETWORK_ID: process.env.REACT_APP_NETWORK_ID || 'default',
    NODE_URL: process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com',
    PUBLIC_URL: process.env.PUBLIC_URL || 'https://rpc.nearprotocol.com',
    RECAPTCHA_CHALLENGE_API_KEY: process.env.RECAPTCHA_CHALLENGE_API_KEY,
    REACT_APP_USE_TESTINGLOCKUP: process.env.REACT_APP_USE_TESTINGLOCKUP,
    RECAPTCHA_ENTERPRISE_SITE_KEY: process.env.RECAPTCHA_ENTERPRISE_SITE_KEY,
    RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL,
    RENDER_GIT_COMMIT: process.env.RENDER_GIT_COMMIT,
    REVIEW_ID: process.env.REVIEW_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: process.env.SENTRY_RELEASE
        || (process.env.RENDER && `render:${process.env.RENDER_SERVICE_NAME}:${process.env.RENDER_GIT_BRANCH}:${process.env.RENDER_GIT_COMMIT}`)
        || 'development',
    SHOW_PRERELEASE_WARNING: process.env.SHOW_PRERELEASE_WARNING === 'true' || process.env.SHOW_PRERELEASE_WARNING === 'yes',
    SHOULD_USE_CLOUDFLARE: process.env.USE_CLOUDFLARE === 'true',
    SMS_BLACKLIST: process.env.SMS_BLACKLIST || 'CN,VN',
    STAKING_GAS_BASE: process.env.REACT_APP_STAKING_GAS_BASE || '25000000000000', // 25 Tgas
    WHITELISTED_CONTRACTS: (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(','),
};
