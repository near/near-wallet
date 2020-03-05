import { parse, stringify } from 'query-string'
import { createActions, createAction } from 'redux-actions'
import { Wallet } from '../utils/wallet'
import { getTransactions as getTransactionsApi } from '../utils/explorer-api'
import { push } from 'connected-react-router'
import { loadState, saveState, clearState } from '../utils/sessionStorage'
import { WALLET_CREATE_NEW_ACCOUNT_URL, WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL } from '../utils/wallet'

const wallet = new Wallet()

export const loadAccount = createAction('LOAD_ACCOUNT',
    accountId => wallet.getAccount(accountId).state(),
    accountId => ({ accountId })
)

export function handleRedirectUrl(previousLocation) {
    return (dispatch, getState) => {
        const { pathname } = getState().router.location
        if (pathname.split('/')[1] === WALLET_CREATE_NEW_ACCOUNT_URL) {
            let url = {
                ...getState().account.url,
                redirect_url: previousLocation.pathname
            }
            saveState(url)
            dispatch(refreshUrl(url))
        }
    }
}

export function handleClearUrl() {
    return (dispatch, getState) => {
        const { pathname } = getState().router.location
        if (![...WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL].includes(pathname.split('/')[1])) {
            clearState()
            dispatch(refreshUrl({}))
        }
    }
}

export const parseTransactionsToSign = createAction('PARSE_TRANSACTIONS_TO_SIGN')

export function handleRefreshUrl() {
    return (dispatch, getState) => {
        const { pathname, search } = getState().router.location

        if (pathname.split('/')[1] === WALLET_LOGIN_URL && search !== '') {
            saveState(parse(search))
            dispatch(refreshUrl(parse(search)))
        }
        else {
            dispatch(refreshUrl({
                referrer: document.referrer,
                ...loadState()
            }))
        }

        const { transactions, callbackUrl } = parse(search);
        if (transactions) {
            dispatch(parseTransactionsToSign({ transactions, callbackUrl }));
        }
    }
}

export const redirectToApp = () => (dispatch, getState) => {
    const { account: { url }} = getState()
    dispatch(push({
        pathname: url.redirect_url || '/',
        search: (url && (url.success_url || url.public_key)) ? `?${stringify(url)}` : '',
        state: {
            globalAlertPreventClear: true
        }
    }))
}

export const allowLogin = () => async (dispatch, getState) => {
    const { account } = getState()
    const { url } = account
    const { error } = await dispatch(addAccessKey(account.accountId, url.contract_id, url.public_key, url.success_url, url.title))
    if (error) return

    const { success_url, public_key } = url
    if (success_url) {
        const availableKeys = await wallet.getAvailableKeys();
        const allKeys = availableKeys.map(key => key.toString());
        const parsedUrl = new URL(success_url)
        parsedUrl.searchParams.set('account_id', account.accountId)
        parsedUrl.searchParams.set('public_key', public_key)
        parsedUrl.searchParams.set('all_keys', allKeys.join(','))
        window.location = parsedUrl.href
    } else {
        await dispatch(push({ pathname: '/authorized-apps' }))
    }
}

const defaultCodesFor = (prefix, data) => ({ successCode: `${prefix}.success`, errorCode: `${prefix}.error`, data})

export const { requestCode, setupRecoveryMessage, checkNewAccount, createNewAccount, checkAccountAvailable, getTransactions, clear, clearCode } = createActions({
    REQUEST_CODE: [
        wallet.requestCode.bind(wallet),
        () => defaultCodesFor('account.requestCode')
    ],
    SETUP_RECOVERY_MESSAGE: [
        wallet.setupRecoveryMessage.bind(wallet),
        () => defaultCodesFor('account.setupRecoveryMessage')
    ],
    CHECK_NEW_ACCOUNT: [
        wallet.checkNewAccount.bind(wallet),
        () => defaultCodesFor('account.create')
    ],
    CREATE_NEW_ACCOUNT: [
        wallet.createNewAccount.bind(wallet),
        () => defaultCodesFor('account.create')
    ],
    CHECK_ACCOUNT_AVAILABLE: [
        wallet.checkAccountAvailable.bind(wallet),
        () => defaultCodesFor('account.available')
    ],
    GET_TRANSACTIONS: [getTransactionsApi.bind(wallet), () => ({})],
    CLEAR: null,
    CLEAR_CODE: null
})

export const { getAccessKeys, removeAccessKey, addLedgerAccessKey } = createActions({
    GET_ACCESS_KEYS: [wallet.getAccessKeys.bind(wallet), () => ({})],
    REMOVE_ACCESS_KEY: [wallet.removeAccessKey.bind(wallet), () => ({})],
    ADD_LEDGER_ACCESS_KEY: [wallet.addLedgerAccessKey.bind(wallet), () => ({})],
})

export const { addAccessKey, addAccessKeySeedPhrase, clearAlert } = createActions({
    ADD_ACCESS_KEY: [
        wallet.addAccessKey.bind(wallet),
        (accountId, contractId, publicKey, successUrl, title) => defaultCodesFor('account.login', {title})
    ],
    ADD_ACCESS_KEY_SEED_PHRASE: [
        wallet.addAccessKey.bind(wallet),
        () => defaultCodesFor('account.setupSeedPhrase')
    ],
    CLEAR_ALERT: null,
})

export const { recoverAccountSeedPhrase } = createActions({
    RECOVER_ACCOUNT_SEED_PHRASE: [
        wallet.recoverAccountSeedPhrase.bind(wallet),
        () => defaultCodesFor('account.recoverAccount')
    ],
})

export const { signAndSendTransactions } = createActions({
    SIGN_AND_SEND_TRANSACTIONS: [
        wallet.signAndSendTransactions.bind(wallet),
        () => defaultCodesFor('account.signAndSendTransactions')
    ]
})

export const { switchAccount, refreshAccount, resetAccounts, refreshUrl } = createActions({
    SWITCH_ACCOUNT: wallet.selectAccount.bind(wallet),
    REFRESH_ACCOUNT: [
        wallet.loadAccount.bind(wallet),
        () => ({ accountId: wallet.getAccountId(), })
    ],
    RESET_ACCOUNTS: wallet.clearState.bind(wallet),
    REFRESH_URL: null
})
