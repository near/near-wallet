import BN from 'bn.js';
import { getLocation } from 'connected-react-router';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { PublicKey, KeyType } from 'near-api-js/lib/utils/key_pair';
import { parse } from 'query-string';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { MIN_BALANCE_TO_CREATE } from '../../../../config';
import { Mixpanel } from '../../../../mixpanel';
import { redirectTo, checkIsNew } from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { addLocalKeyAndFinishSetup, createAccountFromImplicit } from '../../../../redux/slices/account/createAccountThunks';
import { actions as createFromImplicitActions } from '../../../../redux/slices/createFromImplicit';
import { actions as flowLimitationActions } from '../../../../redux/slices/flowLimitation';
import { getSignedUrl } from '../../../../utils/moonpay';
import useRecursiveTimeout from '../../../../utils/useRecursiveTimeout';
import { wallet } from '../../../../utils/wallet';
import FundingReceived from './FundingReceived';
import FundWithCreditCard from './FundWithCreditCard';
import FundWithManualDeposit from './FundWithManualDeposit';

const { handleFlowLimitation } = flowLimitationActions;

const { setCreateFromImplicitSuccess } = createFromImplicitActions;

export function InitialDepositWrapper({ history }) {
    const dispatch = useDispatch();

    const [fundingNeeded, setFundingNeeded] = useState(true);
    const [initialDeposit, setInitialDeposit] = useState('');
    const [moonpaySignedUrl, setMoonpaySignedUrl] = useState('');
    const [claimingAccount, setClaimingAccount] = useState(false);

    const location = useSelector(getLocation);
    const URLParams = parse(location.search);
    const accountId = URLParams.accountId;
    const implicitAccountId = URLParams.implicitAccountId;
    const recoveryMethod = URLParams.recoveryMethod;
    const fundingMethod = URLParams.fundingMethod;

    const formattedMinDeposit = formatNearAmount(MIN_BALANCE_TO_CREATE);

    useEffect(() => {
        const handleSetMoonpayURL = async () => {
            const moonpaySignedUrl = await getSignedUrl(implicitAccountId, window.location.href);
            setMoonpaySignedUrl(moonpaySignedUrl);
        };
        if (fundingMethod === 'creditCard') {
            handleSetMoonpayURL();
        }
    }, [
        fundingMethod,
        implicitAccountId,
        window.location.href
    ]);

    useEffect(() => {
        dispatch(handleFlowLimitation());
    }, []);

    useRecursiveTimeout(async () => {
        await checkFundingAddressBalance().catch(() => { });
    }, 3000);

    const onClickCancel = () => {
        history.goBack();
    };

    const checkFundingAddressBalance = async () => {
        if (fundingNeeded) {
            await Mixpanel.withTracking('CA Check balance from implicit',
                async () => {
                    try {
                        const account = wallet.getAccountBasic(implicitAccountId);
                        const state = await account.state();
                        if (new BN(state.amount).gte(new BN(MIN_BALANCE_TO_CREATE))) {
                            Mixpanel.track('CA Check balance from implicit: sufficient');
                            setFundingNeeded(false);
                            setInitialDeposit(state.amount);
                            return;
                        } else {
                            console.log('Insufficient funding amount');
                            Mixpanel.track('CA Check balance from implicit: insufficient');
                        }
                    } catch (e) {
                        if (e.message.includes('does not exist while viewing')) {
                            return;
                        }
                        throw e;
                    }
                },
                (e) => {
                    throw e;
                }
            );
        }
    };

    const handleClaimAccount = async () => {
        await Mixpanel.withTracking('CA Create account from implicit',
            async () => {
                setClaimingAccount(true);
                await dispatch(createAccountFromImplicit({ accountId, implicitAccountId, recoveryMethod })).unwrap();
            },
            async (e) => {
                console.warn(e);

                const isNewAccount = await checkIsNew(accountId);
                if (isNewAccount) {
                    // No on-chain account exists; throw error on UI so that user can try again
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'walletErrorCodes.createNewAccount.error',
                        errorMessage: e.message
                    }));
                    throw e;
                }

                // On-chain account exists; verify that it is owned by the current key
                const accessKeys = await wallet.getAccessKeys(accountId) || [];
                const publicKeys = accessKeys.map((key) => key.public_key);
                const publicKey = new PublicKey({ keyType: KeyType.ED25519, data: Buffer.from(implicitAccountId, 'hex') });
                const publicKeyExistsOnAccount = publicKeys.includes(publicKey.toString());

                if (!publicKeyExistsOnAccount) {
                    // Someone else must've created the account (or a two-tabs-open situation)
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'walletErrorCodes.createNewAccount.accountExists.error',
                        errorMessage: e.message
                    }));
                    throw e;
                }

                // Assume a transient error occurred, but that the account is on-chain and we can finish the creation process
                try {
                    await wallet.saveAndMakeAccountActive(accountId);
                    await dispatch(addLocalKeyAndFinishSetup({ accountId, recoveryMethod, publicKey })).unwrap();
                } catch (e) {
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'walletErrorCodes.createNewAccount.accountCreated.error',
                        errorMessage: e.message
                    }));
                    dispatch(redirectTo('/recover-account'));
                    throw e;
                }
            },
            () => {
                setClaimingAccount(false);
            }
        );
        dispatch(setCreateFromImplicitSuccess(true));
        dispatch(redirectTo('/'));
    };

    if (!fundingNeeded) {
        return (
            <FundingReceived
                accountId={accountId}
                initialDeposit={initialDeposit}
                onClaimAccount={handleClaimAccount}
                claimingAccount={claimingAccount}
            />
        );
    }

    if (fundingMethod === 'creditCard') {
        return (
            <FundWithCreditCard
                minDeposit={MIN_BALANCE_TO_CREATE}
                formattedMinDeposit={formattedMinDeposit}
                fundingAddress={implicitAccountId}
                moonpaySignedUrl={moonpaySignedUrl}
                onClickCancel={onClickCancel}
            />
        );
    }

    return (
        <FundWithManualDeposit
            minDeposit={MIN_BALANCE_TO_CREATE}
            formattedMinDeposit={formattedMinDeposit}
            fundingAddress={implicitAccountId}
            onClickCancel={onClickCancel}
        />
    );
}
