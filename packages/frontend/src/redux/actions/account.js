import { 
    getLocation,
    push
} from 'connected-react-router';
import { parse, stringify } from 'query-string';
import { createActions, createAction } from 'redux-actions';

import { DISABLE_CREATE_ACCOUNT } from '../../config';
import { 
    showAlert
} from '../../utils/alerts';
import { 
    loadState,
    saveState,
    clearState
} from '../../utils/sessionStorage';
import { TwoFactor } from '../../utils/twoFactor';
import { wallet, WALLET_INITIAL_DEPOSIT_URL } from '../../utils/wallet';
import {
    WALLET_CREATE_NEW_ACCOUNT_URL,
    WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS,
    WALLET_LOGIN_URL,
    WALLET_SIGN_URL,
    WALLET_RECOVER_ACCOUNT_URL,
    WALLET_LINKDROP_URL,
    setKeyMeta,
    ENABLE_IDENTITY_VERIFIED_ACCOUNT
} from '../../utils/wallet';
import { WalletError } from '../../utils/walletError';
import { withAlert } from '../reducers/status';
import refreshAccountOwner from '../sharedThunks/refreshAccountOwner';
import { 
    selectAccountAccountsBalances,
    selectAccountId,
    selectAccountUrl,
    selectAccountUrlCallbackUrl,
    selectAccountUrlContractId,
    selectAccountUrlFailureUrl,
    selectAccountUrlMeta,
    selectAccountUrlMethodNames,
    selectAccountUrlPublicKey,
    selectAccountUrlRedirectUrl,
    selectAccountUrlSuccessUrl,
    selectAccountUrlTitle,
    selectAccountUrlTransactions,
    selectActiveAccountIdIsImplicitAccount
} from '../slices/account';
import { selectAccountHasLockup } from '../slices/account';
import { createAccountWithSeedPhrase } from '../slices/account/createAccountThunks';
import { selectAllAccountsHasLockup } from '../slices/allAccounts';
import { selectAvailableAccounts } from '../slices/availableAccounts';
import { 
    actions as flowLimitationActions,
    selectFlowLimitationAccountBalance,
    selectFlowLimitationAccountData
 } from '../slices/flowLimitation';
import {
    handleStakingUpdateAccount,
    handleStakingUpdateLockup,
    handleGetLockup
} from './staking';

const { 
    handleFlowLimitation,
    handleClearflowLimitation
} = flowLimitationActions;

export const getProfileStakingDetails = (externalAccountId) => async (dispatch, getState) => {
    await dispatch(handleGetLockup(externalAccountId));

    await dispatch(handleStakingUpdateAccount([], externalAccountId));

    const lockupIdExists = externalAccountId
        ? selectAllAccountsHasLockup(getState(), { accountId: externalAccountId })
        : selectAccountHasLockup(getState());

    lockupIdExists
        && dispatch(handleStakingUpdateLockup(externalAccountId));
};

export const handleRedirectUrl = (previousLocation) => (dispatch, getState) => {
    const { pathname } = getLocation(getState());
    const isValidRedirectUrl = previousLocation.pathname.includes(WALLET_LOGIN_URL) || previousLocation.pathname.includes(WALLET_SIGN_URL);
    const page = pathname.split('/')[1];
    const guestLandingPage = !page && !wallet.accountId;
    const createAccountPage = page === WALLET_CREATE_NEW_ACCOUNT_URL;
    const recoverAccountPage = page === WALLET_RECOVER_ACCOUNT_URL;

    if ((guestLandingPage || createAccountPage || recoverAccountPage) && isValidRedirectUrl) {
        let url = {
            ...selectAccountUrl(getState()),
            redirect_url: previousLocation.pathname
        };
        saveState(url);
        dispatch(refreshUrl(url));
    }
};

export const handleClearUrl = () => (dispatch, getState) => {
    const { pathname } = getLocation(getState());
    const page = pathname.split('/')[1];
    const guestLandingPage = !page && !wallet.accountId;
    const saveUrlPages = [...WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL, WALLET_SIGN_URL, WALLET_LINKDROP_URL].includes(page);
    const initialDepositPage = WALLET_INITIAL_DEPOSIT_URL.includes(page);

    if (!guestLandingPage && !saveUrlPages) {
        clearState();
        dispatch(refreshUrl({}));
        dispatch(handleClearflowLimitation());
    }
    else if (!initialDepositPage) {
        dispatch(handleClearflowLimitation());
    }
};

export const parseTransactionsToSign = createAction('PARSE_TRANSACTIONS_TO_SIGN');

export const handleRefreshUrl = (prevRouter) => (dispatch, getState) => {
    const { pathname, search } = prevRouter?.location || getLocation(getState());
    const currentPage = pathname.split('/')[pathname[1] === '/' ? 2 : 1];

    if ([...WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, WALLET_LOGIN_URL, WALLET_SIGN_URL, WALLET_LINKDROP_URL].includes(currentPage)) {
        const parsedUrl = {
            ...parse(search),
            referrer: document.referrer ? new URL(document.referrer).hostname : undefined,
            redirect_url: prevRouter ? prevRouter.location.pathname : undefined
        };
        if ([WALLET_CREATE_NEW_ACCOUNT_URL, WALLET_LINKDROP_URL].includes(currentPage) && search !== '') {
            saveState(parsedUrl);
            dispatch(refreshUrl(parsedUrl));
        } else if ([WALLET_LOGIN_URL, WALLET_SIGN_URL].includes(currentPage) && search !== '') {
            saveState(parsedUrl);
            dispatch(refreshUrl(parsedUrl));
            dispatch(checkContractId());
        } else {
            dispatch(refreshUrl(loadState()));
        }
        dispatch(handleFlowLimitation());

        const transactions = selectAccountUrlTransactions(getState());
        const callbackUrl = selectAccountUrlCallbackUrl(getState());
        const meta = selectAccountUrlMeta(getState());

        if (transactions) {
            dispatch(parseTransactionsToSign({ transactions, callbackUrl, meta }));
        }
    }
};

const checkContractId = () => async (dispatch, getState) => {
    const contractId = selectAccountUrlContractId(getState());
    const failureUrl = selectAccountUrlFailureUrl(getState());

    if (contractId) {
        const redirectIncorrectContractId = () => {
            console.error('Invalid contractId:', contractId);
            dispatch(redirectTo(`/${WALLET_LOGIN_URL}/?invalidContractId=true&failure_url=${failureUrl}`, { globalAlertPreventClear: true }));
        };

        if (!wallet.isLegitAccountId(contractId)) {
            redirectIncorrectContractId();
            return;
        }

        try {
            await wallet.getAccountBasic(contractId).state();
        } catch (error) {
            if (error.message.indexOf('does not exist while viewing') !== -1) {
                redirectIncorrectContractId();
            }
        }
    }
};

export const redirectTo = (location, state = {}) => (dispatch) => {
    const [pathname, search] = location.split('?');
    dispatch(push({
        pathname,
        search,
        state
    }));
};

export const redirectToApp = (fallback) => async (dispatch, getState) => {
    dispatch(handleRefreshUrl());
    const url = selectAccountUrl(getState());
    dispatch(push({
        pathname: (url && url.redirect_url !== '/' && url.redirect_url) || fallback || '/',
        search: (url && (url.success_url || url.public_key)) ? `?${stringify(url)}` : '',
        state: {
            globalAlertPreventClear: true
        }
    }));
};

export const allowLogin = () => async (dispatch, getState) => {
    const contractId = selectAccountUrlContractId(getState());
    const publicKey = selectAccountUrlPublicKey(getState());
    const methodNames = selectAccountUrlMethodNames(getState());
    const title = selectAccountUrlTitle(getState());
    const successUrl = selectAccountUrlSuccessUrl(getState());

    if (successUrl) {
        if (publicKey) {
            await dispatch(withAlert(addAccessKey(wallet.accountId, contractId, publicKey, false, methodNames), { onlyError: true }));
        }
        const availableKeys = await wallet.getAvailableKeys();
        
        const allKeys = availableKeys.map(key => key.toString());
        const url = new URL(successUrl);
        const originalSearchParams = parse(url.search);
        window.location = `${url.origin}${url.pathname}?${stringify(
            {
                ...originalSearchParams,
                account_id: wallet.accountId,
                public_key: publicKey,
                all_keys: allKeys.join(","),
            },
            {
                skipEmptyString: true,
                skipNull: true,
                arrayFormat: "comma"
            }
        )}`;
    } else {
        await dispatch(withAlert(addAccessKey(wallet.accountId, contractId, publicKey, false, methodNames), { data: { title } }));
        dispatch(redirectTo('/authorized-apps', { globalAlertPreventClear: true }));
    }
};

const twoFactorMethod = async (method, wallet, args) => {
    const account = await wallet.getAccount(wallet.accountId);
    if (account[method]) {
        return await account[method](...args);
    }
    return false;
};

export const {
    initializeRecoveryMethod,
    validateSecurityCode,
    initTwoFactor,
    reInitTwoFactor,
    resendTwoFactor,
    verifyTwoFactor,
    promptTwoFactor,
    deployMultisig,
    disableMultisig,
    checkCanEnableTwoFactor,
    get2faMethod,
    getLedgerKey,
    getAccountHelperWalletState,
    clearFundedAccountNeedsDeposit,
    getLedgerPublicKey,
    setupRecoveryMessage,
    deleteRecoveryMethod,
    checkNearDropBalance,
    claimLinkdropToAccount,
    checkIsNew,
    checkNewAccount,
    saveAccount,
    checkAccountAvailable,
    clearCode
} = createActions({
    INITIALIZE_RECOVERY_METHOD: [
        wallet.initializeRecoveryMethod.bind(wallet),
        () => ({})
    ],
    VALIDATE_SECURITY_CODE: [
        wallet.validateSecurityCode.bind(wallet),
        () => ({})
    ],
    INIT_TWO_FACTOR: [
        (...args) => new TwoFactor(wallet, wallet.accountId).initTwoFactor(...args),
        () => ({})
    ],
    REINIT_TWO_FACTOR: [
        (...args) => new TwoFactor(wallet, wallet.accountId).initTwoFactor(...args),
        () => ({})
    ],
    RESEND_TWO_FACTOR: [
        () => twoFactorMethod('sendCode', wallet, []),
        () => ({})
    ],
    VERIFY_TWO_FACTOR: [
        (...args) => new TwoFactor(wallet, wallet.accountId).verifyCodeDefault(...args),
        () => showAlert()
    ],
    PROMPT_TWO_FACTOR: [
        (requestPending) => {
            let promise;
            if (requestPending !== null) {
                promise = new Promise((resolve, reject) => {
                    requestPending = (verified, error) => {
                        if (verified) {
                            resolve(verified);
                        } else {
                            reject(error);
                        }
                    };
                });
            }
            return ({ requestPending, promise });
        },
        () => ({})
    ],
    DEPLOY_MULTISIG: [
        () => new TwoFactor(wallet, wallet.accountId).deployMultisig(),
        () => showAlert()
    ],
    DISABLE_MULTISIG: [
        (...args) => twoFactorMethod('disableMultisig', wallet, args),
        () => ({})
    ],
    CHECK_CAN_ENABLE_TWO_FACTOR: [
        (...args) => TwoFactor.checkCanEnableTwoFactor(...args),
        () => ({})
    ],
    GET_2FA_METHOD: [
        (...args) => twoFactorMethod('get2faMethod', wallet, args),
        () => ({})
    ],
    GET_LEDGER_KEY: [
        wallet.getLedgerKey.bind(wallet),
        () => ({})
    ],
    GET_ACCOUNT_HELPER_WALLET_STATE: [
        wallet.getAccountHelperWalletState.bind(wallet),
        () => ({})
    ],
    CLEAR_FUNDED_ACCOUNT_NEEDS_DEPOSIT: [
        wallet.clearFundedAccountNeedsDeposit.bind(wallet),
        () => showAlert({ onlyError: true })
    ],
    GET_LEDGER_PUBLIC_KEY: [
        wallet.getLedgerPublicKey.bind(wallet),
        () => ({})
    ],
    SETUP_RECOVERY_MESSAGE: [
        wallet.setupRecoveryMessage.bind(wallet),
        () => showAlert()
    ],
    DELETE_RECOVERY_METHOD: [
        wallet.deleteRecoveryMethod.bind(wallet),
        () => showAlert()
    ],
    CHECK_NEAR_DROP_BALANCE: [
        wallet.checkNearDropBalance.bind(wallet),
        () => ({})
    ],
    CLAIM_LINKDROP_TO_ACCOUNT: [
        wallet.claimLinkdropToAccount.bind(wallet),
        () => showAlert({ onlyError: true })
    ],
    CHECK_IS_NEW: [
        wallet.checkIsNew.bind(wallet),
        () => showAlert({ localAlert: true })
    ],
    CHECK_NEW_ACCOUNT: [
        wallet.checkNewAccount.bind(wallet),
        () => showAlert({ localAlert: true })
    ],
    SAVE_ACCOUNT: wallet.saveAccount.bind(wallet),
    CHECK_ACCOUNT_AVAILABLE: [
        wallet.checkAccountAvailable.bind(wallet),
        () => showAlert({ localAlert: true })
    ],
    CLEAR_CODE: null
});

export const {
    getAccessKeys,
    removeAccessKey,
    addLedgerAccessKey,
    sendIdentityVerificationMethodCode,
    disableLedger,
    removeNonLedgerAccessKeys
} = createActions({
    GET_ACCESS_KEYS: [wallet.getAccessKeys.bind(wallet), () => ({})],
    REMOVE_ACCESS_KEY: [
        wallet.removeAccessKey.bind(wallet),
        () => showAlert({ onlyError: true })
    ],
    ADD_LEDGER_ACCESS_KEY: [
        wallet.addLedgerAccessKey.bind(wallet),
        () => showAlert({ onlyError: true })
    ],
    SEND_IDENTITY_VERIFICATION_METHOD_CODE: [
        wallet.sendIdentityVerificationMethodCode.bind(wallet),
        () => showAlert({ localAlert: true })
    ],
    DISABLE_LEDGER: [
        wallet.disableLedger.bind(wallet),
        () => ({})
    ],
    REMOVE_NON_LEDGER_ACCESS_KEYS: [wallet.removeNonLedgerAccessKeys.bind(wallet), () => ({})]
});

export const handleAddAccessKeySeedPhrase = (accountId, recoveryKeyPair) => async (dispatch) => {
    try {
        await dispatch(addAccessKeySeedPhrase(accountId, recoveryKeyPair));
    } catch (error) {
        // error is thrown in `addAccessKeySeedPhrase` action, despite the error, we still want to redirect to /profile
    }
    dispatch(redirectTo('/profile', {
        globalAlertPreventClear: true
    }));
};

const handleFundCreateAccountRedirect = ({
    accountId,
    implicitAccountId,
    recoveryMethod
}) => (dispatch, getState) => {
    const activeAccountIdIsImplicit = selectActiveAccountIdIsImplicitAccount(getState());

    if (ENABLE_IDENTITY_VERIFIED_ACCOUNT) {
        const route = activeAccountIdIsImplicit ? '/fund-with-existing-account' : '/verify-account';
        const search = `?accountId=${accountId}&implicitAccountId=${implicitAccountId}&recoveryMethod=${recoveryMethod}`;
        dispatch(redirectTo(route + search));
    } else {
        dispatch(redirectTo(`/fund-create-account/${accountId}/${implicitAccountId}/${recoveryMethod}`));
    }
};

export const fundCreateAccount = (accountId, recoveryKeyPair, recoveryMethod) => async (dispatch) => {
    await wallet.keyStore.setKey(wallet.connection.networkId, accountId, recoveryKeyPair);
    const implicitAccountId = Buffer.from(recoveryKeyPair.publicKey.data).toString('hex');
    await wallet.keyStore.setKey(wallet.connection.networkId, implicitAccountId, recoveryKeyPair);

    dispatch(handleFundCreateAccountRedirect({
        accountId,
        implicitAccountId,
        recoveryMethod
    }));
};

export const fundCreateAccountLedger = (accountId, ledgerPublicKey) => async (dispatch) => {
    await setKeyMeta(ledgerPublicKey, { type: 'ledger' });
    const implicitAccountId = Buffer.from(ledgerPublicKey.data).toString('hex');
    const recoveryMethod = 'ledger';

    dispatch(handleFundCreateAccountRedirect({
        accountId,
        implicitAccountId,
        recoveryMethod
    }));
};

// TODO: Refactor common code with setupRecoveryMessageNewAccount
export const handleCreateAccountWithSeedPhrase = (accountId, recoveryKeyPair, fundingOptions, recaptchaToken) => async (dispatch) => {

    // Coin-op verify account flow
    if (DISABLE_CREATE_ACCOUNT && ENABLE_IDENTITY_VERIFIED_ACCOUNT && !fundingOptions) {
        await dispatch(fundCreateAccount(accountId, recoveryKeyPair, 'phrase'));
        return;
    }

    // Implicit account flow
    if (DISABLE_CREATE_ACCOUNT && !fundingOptions && !recaptchaToken) {
        await dispatch(fundCreateAccount(accountId, recoveryKeyPair, 'phrase'));
        return;
    }

    try {
        await dispatch(createAccountWithSeedPhrase({ accountId, recoveryKeyPair, fundingOptions, recaptchaToken })).unwrap();
    } catch (error) {
        if (await wallet.accountExists(accountId)) {
            // Requests sometimes fail after creating the NEAR account for another reason (transport error?)
            // If that happened, we allow the user can add the NEAR account to the wallet by entering the seed phrase
            dispatch(redirectTo('/recover-seed-phrase', {
                globalAlertPreventClear: true,
                defaultAccountId: accountId
            }));
            return;
        }
        throw error;
    }
};


export const finishAccountSetup = () => async (dispatch, getState) => {
    await dispatch(refreshAccount());
    await dispatch(clearAccountState());

    const redirectUrl = selectAccountUrlRedirectUrl(getState());
    const accountId = selectAccountId(getState());

    if (redirectUrl) {
        window.location = `${redirectUrl}?accountId=${accountId}`;
    } else {
        dispatch(redirectToApp('/'));
    }
};

export const { 
    addAccessKey,
    addAccessKeySeedPhrase
} = createActions({
    ADD_ACCESS_KEY: [
        wallet.addAccessKey.bind(wallet),
        (title) => showAlert({ title })
    ],
    ADD_ACCESS_KEY_SEED_PHRASE: [
        async (accountId, recoveryKeyPair) => {
            const publicKey = recoveryKeyPair.publicKey.toString();
            const contractName = null;
            const fullAccess = true;

            try {
                await wallet.postSignedJson('/account/seedPhraseAdded', { accountId, publicKey });
                await wallet.addAccessKey(accountId, contractName, publicKey, fullAccess);
            } catch (error) {
                throw new WalletError(error, 'addAccessKeySeedPhrase.errorSecond');
            }
        },
        () => showAlert()
    ]
});

export const { recoverAccountSeedPhrase } = createActions({
    RECOVER_ACCOUNT_SEED_PHRASE: [
        wallet.recoverAccountSeedPhrase.bind(wallet),
        () => showAlert()
    ],
});

export const { recoverAccountSecretKey } = createActions({
    RECOVER_ACCOUNT_SECRET_KEY: [
        wallet.recoverAccountSecretKey.bind(wallet),
        () => showAlert()
    ]
});

export const { sendMoney, transferAllFromLockup } = createActions({
    SEND_MONEY: [
        wallet.sendMoney.bind(wallet),
        () => showAlert({ onlyError: true })
    ],
    TRANSFER_ALL_FROM_LOCKUP: [
        async () => {
            const account = await wallet.getAccount(wallet.accountId);
            if (account.transferAllFromLockup) {
                await account.transferAllFromLockup();
            }
        },
        () => showAlert()
    ]
});

export const refreshAccount = (basicData = false) => async (dispatch, getState) => {
    if (!wallet.accountId) {
        return;
    }

    dispatch(setLocalStorage(wallet.accountId));
    await dispatch(refreshAccountOwner(selectFlowLimitationAccountData(getState()))).unwrap();

    if (!basicData && !selectFlowLimitationAccountBalance(getState())) {
        dispatch(getBalance('', selectFlowLimitationAccountData(getState())));
    }
};

export const switchAccount = ({ accountId }) => async (dispatch) => {
    dispatch(makeAccountActive(accountId));
    dispatch(handleRefreshUrl());
    dispatch(refreshAccount());
    dispatch(clearAccountState());
};

export const getAvailableAccountsBalance = () => async (dispatch, getState) => {
    let accountsBalance = selectAccountAccountsBalances(getState());
    const availableAccounts = selectAvailableAccounts(getState());

    if (selectFlowLimitationAccountData(getState())) {
        return;
    }

    for (let i = 0; i < availableAccounts.length; i++) {
        const accountId = availableAccounts[i];
        if (!accountsBalance[accountId]) {
            i < 0 && await dispatch(setAccountBalance(accountId));
        }
    }

    accountsBalance = selectAccountAccountsBalances(getState());

    for (let i = 0; i < Object.keys(accountsBalance).length; i++) {
        const accountId = Object.keys(accountsBalance)[i];
        if (accountsBalance[accountId].loading) {
            await dispatch(getAccountBalance(accountId));
        }
    }
};

export const { makeAccountActive, refreshAccountExternal, refreshUrl, updateStakingAccount, updateStakingLockup, getBalance, setLocalStorage, getAccountBalance, setAccountBalance, clearAccountState } = createActions({
    MAKE_ACCOUNT_ACTIVE: wallet.makeAccountActive.bind(wallet),
    REFRESH_ACCOUNT_EXTERNAL: [
        async (accountId) => ({
            ...await (await wallet.getAccount(accountId)).state(),
            balance: {
                ...await wallet.getBalance(accountId)
            }
        }),
        accountId => ({
            accountId,
            ...showAlert({ onlyError: true, data: { accountId } })
        })
    ],
    REFRESH_URL: null,
    UPDATE_STAKING_ACCOUNT: [
        async (accountId) => await wallet.staking.updateStakingAccount([], [], accountId),
        (accountId) => ({
            accountId,
            ...showAlert({ onlyError: true })
        })
    ],
    UPDATE_STAKING_LOCKUP: [
        async (accountId) => await wallet.staking.updateStakingLockup(accountId),
        (accountId) => ({
            accountId,
            ...showAlert({ onlyError: true })
        })
    ],
    GET_BALANCE: wallet.getBalance.bind(wallet),
    SET_LOCAL_STORAGE: null,
    GET_ACCOUNT_BALANCE: [
        wallet.getBalance.bind(wallet),
        (accountId) => ({
            accountId,
            alert: {
                ignoreMainLoader: true
            }
        })
    ],
    SET_ACCOUNT_BALANCE: null,
    CLEAR_ACCOUNT_STATE: null
});
