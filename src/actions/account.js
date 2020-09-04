
import { parse, stringify } from 'query-string'
import { createActions, createAction } from 'redux-actions'
import { wallet } from '../utils/wallet'
import { push } from 'connected-react-router'
import { loadState, saveState, clearState } from '../utils/sessionStorage'
import {
    WALLET_CREATE_NEW_ACCOUNT_URL, WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL, WALLET_SIGN_URL,
} from '../utils/wallet'
import { KeyPair } from 'near-api-js'

export const loadRecoveryMethods = createAction('LOAD_RECOVERY_METHODS',
    wallet.getRecoveryMethods.bind(wallet),
    () => ({})
)

export const handleRedirectUrl = (previousLocation) => (dispatch, getState) => {
    const { pathname } = getState().router.location
    const isValidRedirectUrl = previousLocation.pathname.includes(WALLET_LOGIN_URL) || previousLocation.pathname.includes(WALLET_SIGN_URL)

    if (pathname.split('/')[1] === WALLET_CREATE_NEW_ACCOUNT_URL && isValidRedirectUrl) {
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

export const signInWithLedger = () => async (dispatch, getState) => {
    await dispatch(getLedgerAccountIds())
    
    const accountIds = Object.keys(getState().ledger.signInWithLedger)
    for (let i = 0; i < accountIds.length; i++) {
        await dispatch(addLedgerAccountId(accountIds[i]))
        await dispatch(setLedgerTxSigned(false, accountIds[i]))
    }

    return dispatch(saveAndSelectLedgerAccounts(getState().ledger.signInWithLedger))
}

const defaultCodesFor = (prefix, data) => ({ successCode: `${prefix}.success`, errorCode: `${prefix}.error`, prefix, data})

export const { initializeRecoveryMethod, validateSecurityCode, initTwoFactor, reInitTwoFactor, sendTwoFactor, resendTwoFactor, verifyTwoFactor, promptTwoFactor, deployMultisig, get2faMethod, getLedgerKey, getLedgerPublicKey, setupRecoveryMessage, deleteRecoveryMethod, checkNewAccount, createNewAccount, checkAccountAvailable, getTransactions, getTransactionStatus, clear, clearCode } = createActions({
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
        (requestPending) => {
            let promise
            if (requestPending !== null) {
                promise = new Promise((resolve, reject) => {
                    requestPending = (verified, error) => {
                        if (verified) {
                            resolve(verified)
                        } else {
                            reject(error)
                        }
                        // if the user was recovering, they should start over
                        wallet.tempTwoFactorAccount = null
                    }
                })
            }
            return ({ requestPending, promise })
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
    GET_LEDGER_PUBLIC_KEY: [
        wallet.getLedgerPublicKey.bind(wallet),
        () => defaultCodesFor('account.LedgerPublicKey')
    ],
    SETUP_RECOVERY_MESSAGE: [
        wallet.setupRecoveryMessage.bind(wallet),
        (accountId, method, securityCode, isNew) => ({
            ...defaultCodesFor('account.setupRecoveryMessage'),
            isNew
        })
    ],
    DELETE_RECOVERY_METHOD: [
        wallet.deleteRecoveryMethod.bind(wallet),
        () => defaultCodesFor('account.deleteRecoveryMethod')
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

export const { getAccessKeys, removeAccessKey, addLedgerAccessKey, connectLedger, disableLedger, removeNonLedgerAccessKeys, getLedgerAccountIds, addLedgerAccountId, saveAndSelectLedgerAccounts, setLedgerTxSigned } = createActions({
    GET_ACCESS_KEYS: [wallet.getAccessKeys.bind(wallet), () => ({})],
    REMOVE_ACCESS_KEY: [
        wallet.removeAccessKey.bind(wallet),
        () => defaultCodesFor('authorizedApps.removeAccessKey', { onlyError: true })
    ],
    ADD_LEDGER_ACCESS_KEY: [wallet.addLedgerAccessKey.bind(wallet), () => defaultCodesFor('errors.ledger', { onlyError: true })],
    CONNECT_LEDGER: [wallet.connectLedger.bind(wallet), () => defaultCodesFor('errors.ledger')],
    DISABLE_LEDGER: [wallet.disableLedger.bind(wallet), () => defaultCodesFor('errors.ledger')],
    REMOVE_NON_LEDGER_ACCESS_KEYS: [wallet.removeNonLedgerAccessKeys.bind(wallet), () => ({})],
    GET_LEDGER_ACCOUNT_IDS: [wallet.getLedgerAccountIds.bind(wallet), () => defaultCodesFor('signInLedger.getLedgerAccountIds')],
    ADD_LEDGER_ACCOUNT_ID: [
        wallet.addLedgerAccountId.bind(wallet),
        (accountId) => ({
            accountId,
            ...defaultCodesFor('signInLedger.addLedgerAccountId')
        })
    ],
    SAVE_AND_SELECT_LEDGER_ACCOUNTS: [wallet.saveAndSelectLedgerAccounts.bind(wallet), () => defaultCodesFor('signInLedger.saveAndSelectLedgerAccounts')],
    SET_LEDGER_TX_SIGNED: [
        (status) => ({ status }),
        (status, accountId) => ({
            accountId
        })
    ]
})

export const { addAccessKey, addAccessKeySeedPhrase, clearAlert } = createActions({
    ADD_ACCESS_KEY: [
        wallet.addAccessKey.bind(wallet),
        (accountId, contractId, publicKey, successUrl, title) => defaultCodesFor('account.login', {title})
    ],
    ADD_ACCESS_KEY_SEED_PHRASE: [
        async (accountId, recoveryKeyPair, isNew, fundingContract, fundingKey) => {
            if (isNew) {
                await wallet.saveAccount(accountId, recoveryKeyPair);
                await wallet.createNewAccount(accountId, fundingContract, fundingKey, recoveryKeyPair.publicKey)
            }

            const publicKey = recoveryKeyPair.publicKey.toString()
            const contractName = null;
            const fullAccess = true;

            if (isNew) {
                const newKeyPair = KeyPair.fromRandom('ed25519')
                const newPublicKey = newKeyPair.publicKey
                await wallet.addAccessKey(accountId, contractName, newPublicKey, fullAccess)
                await wallet.saveAccount(accountId, newKeyPair)
            } else {
                await wallet.addAccessKey(accountId, contractName, publicKey, fullAccess)
            }

            await wallet.postSignedJson('/account/seedPhraseAdded', { accountId, publicKey })
        },
        (accountId, recoveryKeyPair, isNew) => ({
            ...defaultCodesFor('account.setupSeedPhrase'),
            isNew
        })
    ],
    CLEAR_ALERT: null,
})

export const { recoverAccountSeedPhrase } = createActions({
    RECOVER_ACCOUNT_SEED_PHRASE: [
        wallet.recoverAccountSeedPhrase.bind(wallet),
        () => defaultCodesFor('account.recoverAccount')
    ],
})

export const { signAndSendTransactions, setSignTransactionStatus, sendMoney } = createActions({
    SET_SIGN_TRANSACTION_STATUS: [
        (status) => ({ status }),
        () => defaultCodesFor('account.setSignTransactionStatus')
    ],
    SIGN_AND_SEND_TRANSACTIONS: [
        wallet.signAndSendTransactions.bind(wallet),
        () => defaultCodesFor('account.signAndSendTransactions', { onlyError: true })
    ],
    SEND_MONEY: [
        wallet.sendMoney.bind(wallet),
        () => defaultCodesFor('account.sendMoney', { onlyError: true })
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
