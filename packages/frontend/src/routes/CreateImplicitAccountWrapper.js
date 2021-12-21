import BN from 'bn.js';
import { getLocation } from 'connected-react-router';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CreateImplicitAccount from '../components/accounts/create/implicit_account/CreateImplicitAccount';
import { MIN_BALANCE_TO_CREATE } from '../config';
import { Mixpanel } from '../mixpanel';
import { redirectTo } from '../redux/actions/account';
import { showCustomAlert } from '../redux/actions/status';
import { selectAccountId } from '../redux/slices/account';
import { actions as createFromImplicitActions } from '../redux/slices/createFromImplicit';
import { actions as flowLimitationActions } from '../redux/slices/flowLimitation';
import { getSignedUrl } from '../utils/moonpay';
import useRecursiveTimeout from '../utils/useRecursiveTimeout';
import { wallet } from '../utils/wallet';

const { setCreatePersonalizedName } = createFromImplicitActions;
const { handleFlowLimitation } = flowLimitationActions;

export function CreateImplicitAccountWrapper() {
    const dispatch = useDispatch();

    const accountId = useSelector(selectAccountId);

    const [fundingNeeded, setFundingNeeded] = useState(true);
    const [moonpaySignedUrl, setMoonpaySignedUrl] = useState('');

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const implicitAccountId = URLParams.get('implicitAccountId');
    const recoveryMethod = URLParams.get('recoveryMethod');

    const formattedMinDeposit = formatNearAmount(MIN_BALANCE_TO_CREATE);

    useEffect(() => {
        if (accountId === implicitAccountId || !implicitAccountId || !recoveryMethod) {
            dispatch(redirectTo('/'));
        }
    }, [accountId, implicitAccountId, recoveryMethod]);

    useEffect(() => {
        // FIX: Handle coming back from Moonpay, i.e. check active account
        const handleSetMoonpayURL = async () => {
            const moonpaySignedUrl = await getSignedUrl(implicitAccountId, window.location.href, 30);
            setMoonpaySignedUrl(moonpaySignedUrl);
        };
        handleSetMoonpayURL();
    }, [
        implicitAccountId,
        window.location.href
    ]);

    useRecursiveTimeout(async () => {
        await checkFundingAddressBalance().catch(() => { });
    }, 3000);

    const checkFundingAddressBalance = async () => {
        if (fundingNeeded) {
            await Mixpanel.withTracking("CA Check balance from implicit",
                async () => {
                    try {
                        const account = wallet.getAccountBasic(implicitAccountId);
                        const state = await account.state();
                        if (new BN(state.amount).gte(new BN(MIN_BALANCE_TO_CREATE))) {
                            Mixpanel.track("CA Check balance from implicit: sufficient");
                            setFundingNeeded(false);
                            console.log('Minimum funding amount received. Finishing acccount setup.');
                            await wallet.finishSetupImplicitAccount({
                                implicitAccountId,
                                recoveryMethod
                            });
                            dispatch(setCreatePersonalizedName(true));
                            // FIX: Hide Ledger modal if recovery method is ledger
                            return;
                        } else {
                            console.log('Insufficient funding amount');
                            Mixpanel.track("CA Check balance from implicit: insufficient");
                        }
                    } catch (e) {
                        if (e.message.includes('does not exist while viewing')) {
                            return;
                        }
                        dispatch(showCustomAlert({
                            errorMessage: e.message,
                            success: false,
                            messageCodeHeader: 'error'
                        }));
                        throw e;
                    }
                },
                (e) => {
                    throw e;
                }
            );
        }
    };

    return (
        <CreateImplicitAccount
            formattedMinDeposit={formattedMinDeposit}
            implicitAccountId={implicitAccountId}
            onClickBuyButton={(amountUSD) => {
                window.open(
                    `${moonpaySignedUrl}&baseCurrencyAmount=${amountUSD}`,
                    '_blank'
                );
            }}
        />
    );
}