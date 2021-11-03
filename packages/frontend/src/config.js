import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

export const ACCOUNT_HELPER_URL = process.env.REACT_APP_ACCOUNT_HELPER_URL || 'https://near-contract-helper.onrender.com';
export const ACCOUNT_ID_SUFFIX = process.env.REACT_APP_ACCOUNT_ID_SUFFIX || 'testnet';
export const ACCESS_KEY_FUNDING_AMOUNT = process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT || nearApiJs.utils.format.parseNearAmount('0.25');
export const BROWSER_MIXPANEL_TOKEN = process.env.BROWSER_MIXPANEL_TOKEN;
export const DISABLE_CREATE_ACCOUNT = process.env.DISABLE_CREATE_ACCOUNT === 'true' || process.env.DISABLE_CREATE_ACCOUNT === 'yes';
export const DISABLE_PHONE_RECOVERY = process.env.DISABLE_PHONE_RECOVERY === 'yes';
export const EXPLORE_APPS_URL = process.env.EXPLORE_APPS_URL || 'https://awesomenear.com/trending/';
export const EXPLORE_DEFI_URL = process.env.EXPLORE_DEFI_URL || 'https://awesomenear.com/categories/defi/';
export const EXPLORER_URL = process.env.EXPLORER_URL || 'https://explorer.testnet.near.org';
export const HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL = process.env.HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL;
export const IS_MAINNET = process.env.REACT_APP_IS_MAINNET === 'true' || process.env.REACT_APP_IS_MAINNET === 'yes';
export const LINKDROP_GAS = process.env.LINKDROP_GAS || '100000000000000';
export const LOCKUP_ACCOUNT_ID_SUFFIX = process.env.LOCKUP_ACCOUNT_ID_SUFFIX || 'lockup.near';
export const MIN_BALANCE_FOR_GAS = process.env.REACT_APP_MIN_BALANCE_FOR_GAS || nearApiJs.utils.format.parseNearAmount('0.05');
export const MIN_BALANCE_TO_CREATE = process.env.MIN_BALANCE_TO_CREATE || nearApiJs.utils.format.parseNearAmount('0.1');
export const MIN_LOCKUP_AMOUNT = new BN(process.env.MIN_LOCKUP_AMOUNT || nearApiJs.utils.format.parseNearAmount('35.00001'));
export const MOONPAY_API_KEY = process.env.MOONPAY_API_KEY || 'pk_test_wQDTsWBsvUm7cPiz9XowdtNeL5xasP9';
export const MOONPAY_API_URL = process.env.MOONPAY_API_URL || 'https://api.moonpay.com';
export const MOONPAY_BUY_URL = process.env.MOONPAY_BUY_URL || 'https://buy.moonpay.io?apiKey=';
export const TORUS_CLIENT_ID = process.env.TORUS_CLIENT_ID || 'BFmAhi0-B_8HRR7DgsqAc_vzu1JAJ0_vjNlqGHsS-F0sQEPdKoXayu77U1LvyRa8KLooMUM-f1Q9LmHDePUsOWs';
// FIX: Torus client ID should be in the env file etc?
export const MULTISIG_CONTRACT_HASHES = process.env.MULTISIG_CONTRACT_HASHES || [
    // https://github.com/near/core-contracts/blob/fa3e2c6819ef790fdb1ec9eed6b4104cd13eb4b7/multisig/src/lib.rs
    '7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk',
    // https://github.com/near/core-contracts/blob/fb595e6ec09014d392e9874c2c5d6bbc910362c7/multisig/src/lib.rs
    'AEE3vt6S3pS2s7K6HXnZc46VyMyJcjygSMsaafFh67DF',
    // https://github.com/near/core-contracts/blob/636e7e43f1205f4d81431fad0be39c5cb65455f1/multisig/src/lib.rs
    '8DKTSceSbxVgh4ANXwqmRqGyPWCuZAR1fCqGPXUjD5nZ',
    // https://github.com/near/core-contracts/blob/f93c146d87a779a2063a30d2c1567701306fcae4/multisig/res/multisig.wasm
    '55E7imniT2uuYrECn17qJAk9fLcwQW4ftNSwmCJL5Di',
];
export const MULTISIG_MIN_AMOUNT = process.env.REACT_APP_MULTISIG_MIN_AMOUNT || '4';
export const MULTISIG_MIN_PROMPT_AMOUNT = process.env.REACT_APP_MULTISIG_MIN_PROMPT_AMOUNT || '200';
export const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default';
export const NODE_URL = process.env.REACT_APP_NODE_URL || 'https://rpc.nearprotocol.com';
export const PUBLIC_URL = process.env.PUBLIC_URL;
export const REACT_APP_USE_TESTINGLOCKUP = process.env.REACT_APP_USE_TESTINGLOCKUP;
export const RECAPTCHA_CHALLENGE_API_KEY = process.env.RECAPTCHA_CHALLENGE_API_KEY;
export const RECAPTCHA_ENTERPRISE_SITE_KEY = process.env.RECAPTCHA_ENTERPRISE_SITE_KEY;
export const SENTRY_DSN = process.env.SENTRY_DSN;
export const SENTRY_RELEASE = process.env.SENTRY_RELEASE
    || (process.env.RENDER && `render:${process.env.RENDER_SERVICE_NAME}:${process.env.RENDER_GIT_BRANCH}:${process.env.RENDER_GIT_COMMIT}`)
    || 'development';
export const SHOW_PRERELEASE_WARNING = process.env.SHOW_PRERELEASE_WARNING === 'true' || process.env.SHOW_PRERELEASE_WARNING === 'yes';
export const SMS_BLACKLIST = process.env.SMS_BLACKLIST || 'CN,VN';
export const STAKING_GAS_BASE = process.env.REACT_APP_STAKING_GAS_BASE || '25000000000000'; // 25 Tgas
export const WHITELISTED_CONTRACTS = (process.env.TOKEN_CONTRACTS || 'berryclub.ek.near,farm.berryclub.ek.near,wrap.near').split(',');
