
import { parse, stringify } from 'query-string'
import { createActions, createAction } from 'redux-actions'
import { wallet } from '../utils/wallet'
import { push } from 'connected-react-router'
import { loadState, saveState, clearState } from '../utils/sessionStorage'
import {
    WALLET_CREATE_NEW_ACCOUNT_URL, WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL, WALLET_SIGN_URL,
} from '../utils/wallet'

export const loadRecoveryMethods = createAction('LOAD_RECOVERY_METHODS',
    wallet.getRecoveryMethods.bind(wallet),
    () => ({})
)

export const handleRedirectUrl = (previousLocation) => (dispatch, getState) => {
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


export const handleClearUrl = () => (dispatch, getState) => {
    const { pathname } = getState().router.location
    if (![...WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL, WALLET_SIGN_URL].includes(pathname.split('/')[1])) {

        clearState()
        dispatch(refreshUrl({}))
    }
}

export const parseTransactionsToSign = createAction('PARSE_TRANSACTIONS_TO_SIGN')

export const handleRefreshUrl = () => (dispatch, getState) => {
    const { pathname, search } = getState().router.location
    const currentPage = pathname.split('/')[pathname[1] === '/' ? 2 : 1]

    if ([...WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL, WALLET_SIGN_URL].includes(currentPage)) {
        const parsedUrl = {
            referrer: document.referrer && new URL(document.referrer).hostname,
            ...parse(search)
        }

        if ([WALLET_LOGIN_URL, WALLET_SIGN_URL].includes(currentPage) && search !== '') {
            saveState(parsedUrl)
            dispatch(refreshUrl(parsedUrl))
            dispatch(checkContractId())
        } else {
            dispatch(refreshUrl(loadState()))
        }

        const { transactions, callbackUrl } = getState().account.url
        if (transactions) {
            dispatch(parseTransactionsToSign({ transactions, callbackUrl }))
        }
    }
}

const checkContractId = () => async (dispatch, getState) => {
    const { contract_id } = getState().account.url

    if (contract_id) {
        const redirectIncorrectContractId = () => {
            console.error('Invalid contractId:', contract_id)
            dispatch(push({ pathname: `/${WALLET_LOGIN_URL}/incorrect-contract-id` }))
        }

        if (!wallet.isLegitAccountId(contract_id)) {
            redirectIncorrectContractId()
            return
        }

        try {
            await wallet.getAccount(contract_id).state()
        } catch(error) {
            if (error.message.indexOf('does not exist while viewing') !== -1) {
                redirectIncorrectContractId()
            }
        }
    }
}

export const redirectToProfile = () => (dispatch) => dispatch(push({ pathname: '/profile' }))

export const redirectToApp = (fallback) => (dispatch, getState) => {
    const { account: { url }} = getState()
    dispatch(push({
        pathname: (url && url.redirect_url !== '/' && url.redirect_url) || fallback || '/',
        search: (url && (url.success_url || url.public_key)) ? `?${stringify(url)}` : '',
        state: {
            globalAlertPreventClear: true
        }
    }))
}


export const allowLogin = () => async (dispatch, getState) => {
    const { account } = getState()
    const { url } = account
    await dispatch(addAccessKey(account.accountId, url.contract_id, url.public_key))

    const { success_url, public_key } = url
    if (success_url) {
        dispatch(clearAlert())
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

export const { initializeRecoveryMethod, validateSecurityCode, initTwoFactor, reInitTwoFactor, sendTwoFactor, resendTwoFactor, verifyTwoFactor, promptTwoFactor, deployMultisig, get2faMethod, getLedgerKey, getAccountAndState, setupRecoveryMessage, deleteRecoveryMethod, sendNewRecoveryLink, checkNewAccount, createNewAccount, checkAccountAvailable, getTransactions, getTransactionStatus, clear, clearCode } = createActions({
    INITIALIZE_RECOVERY_METHOD: [
        wallet.initializeRecoveryMethod.bind(wallet),
        () => defaultCodesFor('account.initializeRecoveryMethod')
    ],
    VALIDATE_SECURITY_CODE: [
        wallet.validateSecurityCode.bind(wallet),
        () => defaultCodesFor('account.validateSecurityCode')
    ],
    INIT_TWO_FACTOR: [
        wallet.twoFactor.initTwoFactor.bind(wallet.twoFactor),
        () => defaultCodesFor('account.initTwoFactor')
    ],
    REINIT_TWO_FACTOR: [
        wallet.twoFactor.reInitTwoFactor.bind(wallet.twoFactor),
        () => defaultCodesFor('account.reInitTwoFactor')
    ],
    SEND_TWO_FACTOR: [
        wallet.twoFactor.sendRequest.bind(wallet.twoFactor),
        () => defaultCodesFor('account.sendTwoFactor')
    ],
    RESEND_TWO_FACTOR: [
        wallet.twoFactor.resend.bind(wallet.twoFactor),
        () => defaultCodesFor('account.resendTwoFactor')
    ],
    VERIFY_TWO_FACTOR: [
        wallet.twoFactor.verifyTwoFactor.bind(wallet.twoFactor),
        () => defaultCodesFor('account.verifyTwoFactor')
    ],
    PROMPT_TWO_FACTOR: [
        (requestPending = null) => {
            let promise
            if (requestPending !== null) {
                promise = new Promise((resolve) => {
                    requestPending = (verified) => {
                        if (verified) {
                            wallet.tempTwoFactorAccount = null
                        }
                        resolve(verified)
                    }
                })
            }
            return ({ store: { requestPending, promise } })
        },
        () => defaultCodesFor('account.promptTwoFactor')
    ],
    DEPLOY_MULTISIG: [
        wallet.twoFactor.deployMultisig.bind(wallet.twoFactor),
        () => defaultCodesFor('account.deployMultisig')
    ],
    GET_2FA_METHOD: [
        wallet.twoFactor.get2faMethod.bind(wallet.twoFactor),
        () => defaultCodesFor('account.get2faMethod')
    ],
    GET_LEDGER_KEY: [
        wallet.getLedgerKey.bind(wallet),
        () => defaultCodesFor('account.LedgerKey')
    ],
    GET_ACCOUNT_AND_STATE: [
        wallet.getAccountAndState.bind(wallet),
        () => defaultCodesFor('account.getAccountAndState')
    ],
    SETUP_RECOVERY_MESSAGE: [
        wallet.setupRecoveryMessage.bind(wallet),
        () => defaultCodesFor('account.setupRecoveryMessage')
    ],
    DELETE_RECOVERY_METHOD: [
        wallet.deleteRecoveryMethod.bind(wallet),
        () => defaultCodesFor('account.deleteRecoveryMethod')
    ],
    SEND_NEW_RECOVERY_LINK: [
        wallet.sendNewRecoveryLink.bind(wallet),
        () => defaultCodesFor('account.sendNewRecoveryLink')
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
    CLEAR: null,
    CLEAR_CODE: null
})

export const { getAccessKeys, removeAccessKey, addLedgerAccessKey, signInWithLedger, removeNonLedgerAccessKeys, disableLedger } = createActions({
    GET_ACCESS_KEYS: [wallet.getAccessKeys.bind(wallet), () => ({})],
    REMOVE_ACCESS_KEY: [wallet.removeAccessKey.bind(wallet), () => ({})],
    ADD_LEDGER_ACCESS_KEY: [wallet.addLedgerAccessKey.bind(wallet), () => defaultCodesFor('errors.ledger')],
    SIGN_IN_WITH_LEDGER: [wallet.signInWithLedger.bind(wallet), () => defaultCodesFor('signInLedger')],
    REMOVE_NON_LEDGER_ACCESS_KEYS: [wallet.removeNonLedgerAccessKeys.bind(wallet), () => ({})],
    DISABLE_LEDGER: [wallet.disableLedger.bind(wallet), () => defaultCodesFor('errors.ledger')]
})

export const { addAccessKey, addAccessKeySeedPhrase, clearAlert } = createActions({
    ADD_ACCESS_KEY: [
        wallet.addAccessKey.bind(wallet),
        (accountId, contractId, publicKey, successUrl, title) => defaultCodesFor('account.login', {title})
    ],
    ADD_ACCESS_KEY_SEED_PHRASE: [
        async (accountId, contractName, publicKey, isNew, fundingContract, fundingKey) => {
            if (isNew) {
                await wallet.createNewAccount(accountId, fundingContract, fundingKey)
            }
            const res = await wallet.addAccessKey(accountId, contractName, publicKey, true)
            if (res) {
                wallet.postSignedJson.bind(wallet)('/account/seedPhraseAdded', {
                    accountId,
                    publicKey,
                })
            }
            return res
        },
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

export const { switchAccount, refreshAccount, refreshAccountExternal, refreshUrl, setFormLoader } = createActions({
    SWITCH_ACCOUNT: wallet.selectAccount.bind(wallet),
    REFRESH_ACCOUNT: [
        wallet.refreshAccount.bind(wallet),
        () => ({ accountId: wallet.accountId })
    ],
    REFRESH_ACCOUNT_EXTERNAL: [
        async (accountId) => ({
            ...await wallet.getAccount(accountId).state(),
            balance: await wallet.getBalance(accountId)
        }),
        accountId => ({ accountId })
    ],
    REFRESH_URL: null,
    SET_FORM_LOADER: null
})
