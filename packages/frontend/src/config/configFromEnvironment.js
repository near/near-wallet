import assert from "assert";

import Environments from "../../../../features/environments.json";
import {
    parseBooleanFromShell,
    parseObjectFromShell,
    parseCommaSeperatedStringAsArrayFromShell,
} from "./envParsers";

const { NEAR_WALLET_ENV } = process.env;

assert(
    Object.values(Environments).some((env) => NEAR_WALLET_ENV === env),
    `Invalid environment: "${NEAR_WALLET_ENV}"`
);

module.exports = {
    ACCOUNT_HELPER_URL: process.env.REACT_APP_ACCOUNT_HELPER_URL,
    ACCOUNT_ID_SUFFIX: process.env.REACT_APP_ACCOUNT_ID_SUFFIX,
    ACCESS_KEY_FUNDING_AMOUNT: process.env.REACT_APP_ACCESS_KEY_FUNDING_AMOUNT,
    BROWSER_MIXPANEL_TOKEN: process.env.BROWSER_MIXPANEL_TOKEN,
    DISABLE_CREATE_ACCOUNT: parseBooleanFromShell(
        process.env.DISABLE_CREATE_ACCOUNT
    ),
    DISABLE_PHONE_RECOVERY: parseBooleanFromShell(
        process.env.DISABLE_PHONE_RECOVERY
    ),
    EXPLORE_APPS_URL: process.env.EXPLORE_APPS_URL,
    EXPLORE_DEFI_URL: process.env.EXPLORE_DEFI_URL,
    EXPLORER_URL: process.env.EXPLORER_URL,
    HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL: parseBooleanFromShell(
        process.env.HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL
    ),
    IS_MAINNET: [Environments.MAINNET, Environments.MAINNET_STAGING].some(
        (env) => env === process.env.NEAR_WALLET_ENV
    ),
    LINKDROP_GAS: process.env.LINKDROP_GAS,
    LOCKUP_ACCOUNT_ID_SUFFIX: process.env.LOCKUP_ACCOUNT_ID_SUFFIX,
    MIN_BALANCE_FOR_GAS: process.env.REACT_APP_MIN_BALANCE_FOR_GAS,
    MIN_BALANCE_TO_CREATE: process.env.MIN_BALANCE_TO_CREATE,
    MOONPAY_API_KEY: process.env.MOONPAY_API_KEY,
    MOONPAY_API_URL: process.env.MOONPAY_API_URL,
    MOONPAY_BUY_URL: process.env.MOONPAY_BUY_URL,
    MULTISIG_CONTRACT_HASHES: parseObjectFromShell(
        process.env.MULTISIG_CONTRACT_HASHES
    ),
    MULTISIG_MIN_AMOUNT: process.env.REACT_APP_MULTISIG_MIN_AMOUNT,
    MULTISIG_MIN_PROMPT_AMOUNT:
        process.env.REACT_APP_MULTISIG_MIN_PROMPT_AMOUNT,
    NEAR_WALLET_ENV,
    NETWORK_ID: process.env.REACT_APP_NETWORK_ID,
    NODE_URL: process.env.REACT_APP_NODE_URL,
    PUBLIC_URL: process.env.PUBLIC_URL,
    REACT_APP_USE_TESTINGLOCKUP: parseBooleanFromShell(
        process.env.REACT_APP_USE_TESTINGLOCKUP
    ),
    RECAPTCHA_CHALLENGE_API_KEY: process.env.RECAPTCHA_CHALLENGE_API_KEY,
    RECAPTCHA_ENTERPRISE_SITE_KEY: process.env.RECAPTCHA_ENTERPRISE_SITE_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: process.env.SENTRY_RELEASE
        ? process.env.RENDER
            ? `render:${process.env.RENDER_SERVICE_NAME}:${process.env.RENDER_GIT_BRANCH}:${process.env.RENDER_GIT_COMMIT}`
            : undefined
        : undefined,
    SHOW_PRERELEASE_WARNING: parseBooleanFromShell(
        process.env.SHOW_PRERELEASE_WARNING
    ),
    SMS_BLACKLIST: process.env.SMS_BLACKLIST,
    STAKING_GAS_BASE: process.env.REACT_APP_STAKING_GAS_BASE,
    WHITELISTED_CONTRACTS: parseCommaSeperatedStringAsArrayFromShell(
        process.env.TOKEN_CONTRACTS
    ),
};
