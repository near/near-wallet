import BN from 'bn.js';
import { getLocation } from 'connected-react-router';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { createAccountFromImplicit, redirectTo } from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { getSignedUrl } from '../../../../utils/moonpay';
import { MIN_BALANCE_TO_CREATE, wallet } from '../../../../utils/wallet';
import FundingReceived from './FundingReceived';
import FundWithCreditCard from './FundWithCreditCard';
import FundWithManualDeposit from './FundWithManualDeposit';

export function InitialDepositWrapper({ history }) {
    const dispatch = useDispatch();

    let pollAccountBalanceHandle = null;

    const [fundingNeeded, setFundingNeeded] = useState(true);
    const [initialDeposit, setInitialDeposit] = useState('');
    const [moonpaySignedUrl, setMoonpaySignedUrl] = useState('');
    const [claimingAccount, setClaimingAccount] = useState(false);

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const accountId = URLParams.get('accountId');
    const implicitAccountId = URLParams.get('implicitAccountId');
    const recoveryMethod = URLParams.get('recoveryMethod');
    const fundingMethod = URLParams.get('fundingMethod');

    const formattedMinDeposit = formatNearAmount(MIN_BALANCE_TO_CREATE);

    useEffect(() => {
        const handleSetMoonpayURL = async () => {
            const moonpaySignedUrl = await getSignedUrl(implicitAccountId, window.location.origin);
            setMoonpaySignedUrl(moonpaySignedUrl);
        };
        if (fundingMethod === 'creditCard') {
            handleSetMoonpayURL();
        }
    }, []);

    useEffect(() => {
        startPollingAccountBalance();
        return () => { stopPollingAccountBalance(); };
    }, []);

    const onClickCancel = () => {
        history.goBack();
    };

    const startPollingAccountBalance = () => {
        const handleCheckBalance = async () => {
            await checkFundingAddressBalance().catch(() => { });
            if (pollAccountBalanceHandle) {
                pollAccountBalanceHandle = setTimeout(() => handleCheckBalance(), 3000);
            }
        };
        pollAccountBalanceHandle = setTimeout(() => handleCheckBalance(), 3000);
    };

    const stopPollingAccountBalance = () => {
        clearTimeout(pollAccountBalanceHandle);
        pollAccountBalanceHandle = null;
    };

    const checkFundingAddressBalance = async () => {
        if (fundingNeeded) {
            const account = wallet.getAccountBasic(implicitAccountId);
            const state = await account.state();

            if (new BN(state.amount).gte(new BN(MIN_BALANCE_TO_CREATE))) {
                setFundingNeeded(false);
                setInitialDeposit(state.amount);
            }
        }
    };

    const handleClaimAccount = async () => {
        try {
            setClaimingAccount(true);
            await dispatch(createAccountFromImplicit(accountId, implicitAccountId, recoveryMethod));
        } catch(e) {
            setClaimingAccount(false);
            showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                errorMessage: e.message
            });
            throw e;
        }
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