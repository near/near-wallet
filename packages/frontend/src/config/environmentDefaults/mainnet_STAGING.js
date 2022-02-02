import * as nearApiJs from "near-api-js";
import { parseNearAmount } from "near-api-js/lib/utils/format";

export default {
    ACCOUNT_HELPER_URL: 'https://helper.mainnet.near.org',
    ACCOUNT_ID_SUFFIX: 'near',
    ACCESS_KEY_FUNDING_AMOUNT: nearApiJs.utils.format.parseNearAmount('0.25'),
    ALLOW_2FA_ENABLE_HASHES: [
        'E8jZ1giWcVrps8PcV75ATauu6gFRkcwjNtKp7NKmipZG',
        '11111111111111111111111111111111'
    ],
    BROWSER_MIXPANEL_TOKEN: 'd5bbbbcc3a77ef8427f2b806b5689bf8',
    DISABLE_CREATE_ACCOUNT: true,
    DISABLE_PHONE_RECOVERY: true,
    EXPLORE_APPS_URL: 'https://awesomenear.com/',
    EXPLORE_DEFI_URL: 'https://awesomenear.com/categories/defi/',
    EXPLORER_URL: 'https://explorer.mainnet.near.org',
    HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL: false,
    LINKDROP_GAS: '100000000000000',
    LOCKUP_ACCOUNT_ID_SUFFIX: 'lockup.near',
    MIN_BALANCE_FOR_GAS: nearApiJs.utils.format.parseNearAmount('0.05'),
    MIN_BALANCE_TO_CREATE: nearApiJs.utils.format.parseNearAmount('0.1'),
    MOONPAY_API_KEY: 'pk_live_jYDdkGL7bJsrwalHZs1lVIhdOHOtK8BR',
    MOONPAY_API_URL: 'https://api.moonpay.com',
    MOONPAY_BUY_URL: 'https://buy.moonpay.io?apiKey=',
    MULTISIG_CONTRACT_HASHES: [
        // https://github.com/near/core-contracts/blob/fa3e2c6819ef790fdb1ec9eed6b4104cd13eb4b7/multisig/src/lib.rs
        '7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk',
        // https://github.com/near/core-contracts/blob/fb595e6ec09014d392e9874c2c5d6bbc910362c7/multisig/src/lib.rs
        'AEE3vt6S3pS2s7K6HXnZc46VyMyJcjygSMsaafFh67DF',
        // https://github.com/near/core-contracts/blob/636e7e43f1205f4d81431fad0be39c5cb65455f1/multisig/src/lib.rs
        '8DKTSceSbxVgh4ANXwqmRqGyPWCuZAR1fCqGPXUjD5nZ',
        // https://github.com/near/core-contracts/blob/f93c146d87a779a2063a30d2c1567701306fcae4/multisig/res/multisig.wasm
        '55E7imniT2uuYrECn17qJAk9fLcwQW4ftNSwmCJL5Di',
    ],
    MULTISIG_MIN_AMOUNT: '4',
    MULTISIG_MIN_PROMPT_AMOUNT: '200',
    NETWORK_ID: 'default',
    NODE_URL: 'https://rpc.mainnet.near.org',
    REACT_APP_USE_TESTINGLOCKUP: false,
    RECAPTCHA_CHALLENGE_API_KEY: '6LeRzswaAAAAAGeS7mSasZ1wDcGnMcH3D7W1gy1b',
    RECAPTCHA_ENTERPRISE_SITE_KEY: '6LcpJ3EcAAAAAFgA-nixKFNGWMo9IG9FQhH4XjSY',
    SENTRY_DSN: 'https://15d0d1b94e8548dd9663b8c93bf4550a@o398573.ingest.sentry.io/5396205',
    SHOW_PRERELEASE_WARNING: true,
    SMS_BLACKLIST: ['CN', 'VN', 'TH'],
    STAKING_GAS_BASE: '25000000000000', // 25 Tgas
    WHITELISTED_CONTRACTS: [
        'berryclub.ek.near',
        'wrap.near',
        '6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near',
    ],
    NEAR_TOKEN_ID: 'wrap.near',
    FARMING_CLAIM_GAS: parseNearAmount('0.00000000015'),
    FARMING_CLAIM_YOCTO: '1'
};
