import { parse, stringify } from 'query-string'
import { createActions, createAction } from 'redux-actions'
import { Wallet } from '../utils/wallet'
import { getTransactions as getTransactionsApi } from '../utils/explorer-api'
import { push } from 'connected-react-router'

export const REFRESH_ACCOUNT = 'REFRESH_ACCOUNT'
export const LOADER_ACCOUNT = 'LOADER_ACCOUNT'
export const REFRESH_URL = 'REFRESH_URL'

export const loadAccount = createAction('LOAD_ACCOUNT',
    accountId => wallet.getAccount(accountId).state(),
    accountId => ({ accountId })
)

// TODO: Refactor whole mess with handleRefreshAccount / handleLoginUrl / handleRedirectUrl / handleRefreshUrl into smaller and better scoped actions
export function handleRefreshAccount(history, loader = true) {
    return (dispatch, getState) => {
        // TODO: Use promise-based action with automated loading handler?
        if (loader) {
            dispatch({
                type: LOADER_ACCOUNT,
                loader: true
            })
        }

        if (wallet.isEmpty()) {
            if (loader) {
                dispatch({
                    type: LOADER_ACCOUNT,
                    loader: false
                })
            }

            return false
        }

        const accountId = wallet.getAccountId()

        wallet
            .loadAccount(accountId)
            .then(v => {
                // TODO: Should use reducer instead to process loadAccount success results?
                dispatch({
                    type: REFRESH_ACCOUNT,
                    data: {
                        accountId: accountId,
                        amount: v['amount'] || 0,
                        stake: v['stake'],
                        nonce: v['nonce'],
                        code_hash: v['code_hash'],
                        accounts: wallet.accounts
                    }
                })
            })
            .catch(e => {
                console.error('Error loading account:', e)

                if (e.message && e.message.indexOf('does not exist while viewing') !== -1) {
                    // We have an account in the storage, but it doesn't exist on blockchain. We probably nuked storage so just redirect to create account
                    // TODO: Offer to remove specific account vs clearing everything?
                    wallet.clearState()
                    wallet.redirectToCreateAccount(
                        {
                            reset_accounts: true
                        },
                        history
                    )
                }
            })
            .finally(() => {
                if (loader) {
                    dispatch({
                        type: LOADER_ACCOUNT,
                        loader: false
                    })
                }
            })
    }
}

export function handleLoginUrl(location) {
    return (dispatch, getState) => {
        if (!location) {
            location = getState().router.location
        }

        if (location.search === '') {
            return false
        }

        const loginUrl = parse(location.search)

        try {
            sessionStorage.setItem('wallet:url', JSON.stringify(loginUrl))
        } catch(err) {
            console.warn(err)
        }

        dispatch({
            type: REFRESH_URL,
            url: loginUrl
        })
    }
}

export function handleRedirectUrl(previousLocation) {
    return (dispatch, getState) => {
        const { account: { url } } = getState()

        const redirectUrl = {
            ...url,
            redirect_url: previousLocation.pathname,
        }

        try {
            sessionStorage.setItem('wallet:url', JSON.stringify(redirectUrl))
        } catch(err) {
            console.warn(err)
        }

        dispatch({
            type: REFRESH_URL,
            url: redirectUrl
        })
    }
}

export const parseTransactionsToSign = createAction('PARSE_TRANSACTIONS_TO_SIGN')

export function handleRefreshUrl() {
    return (dispatch, getState) => {
        const { router: { location } } = getState()

        let accountUrl = {
            referrer: document.referrer
        }

        try {
            accountUrl = {
                ...accountUrl,
                ...JSON.parse(sessionStorage.getItem('wallet:url'))
            }
        } catch(err) {
            console.warn(err)
        }

        dispatch({
            type: REFRESH_URL,
            url: accountUrl
        })

        const { transactions, callbackUrl } = parse(location.search);
        if (transactions) {
            dispatch(parseTransactionsToSign({ transactions, callbackUrl }));
        }
    }
}

const wallet = new Wallet()

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

export const { requestCode, setupAccountRecovery, setupRecoveryMessage, recoverAccount, checkNewAccount, createNewAccount, checkAccountAvailable, getTransactions, clear, clearCode } = createActions({
    REQUEST_CODE: [
        wallet.requestCode.bind(wallet),
        () => defaultCodesFor('account.requestCode')
    ],
    SETUP_ACCOUNT_RECOVERY: [
        wallet.setupAccountRecovery.bind(wallet),
        () => defaultCodesFor('account.setupAccountRecovery')
    ],
    SETUP_RECOVERY_MESSAGE: [
        wallet.setupRecoveryMessage.bind(wallet),
        () => defaultCodesFor('account.setupRecoveryMessage')
    ],
    RECOVER_ACCOUNT: [
        wallet.recoverAccount.bind(wallet),
        () => defaultCodesFor('account.recoverAccount')
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

export const { switchAccount } = createActions({
    SWITCH_ACCOUNT: wallet.selectAccount.bind(wallet)
})
