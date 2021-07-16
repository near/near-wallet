import BN from 'bn.js';
import { utils } from 'near-api-js';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    redirectTo,
    checkAccountAvailable
} from '../../actions/account';
import { clearLocalAlert } from '../../actions/status';
import { handleGetTokens } from '../../actions/tokens';
import { selectTokensDetails } from '../../reducers/tokens';
import { WALLET_APP_MIN_AMOUNT } from '../../utils/wallet';
import SendContainerV2 from './SendContainerV2';

const { parseNearAmount, formatNearAmount } = utils.format;

// TODO: Should this be calculated depending on need for storage deposit?
const SEND_TOKEN_TX_FEE_AMOUNT = '0.002';

const getAvailableNearToSend = (availableBalance, reservedForFees) => {
    const availableToSendBN = new BN(availableBalance).sub(new BN(reservedForFees));
    return availableToSendBN.isNeg() ? '0' : availableToSendBN.toString();
};

export function SendContainerWrapper() {
    const dispatch = useDispatch();
    const { accountId, balance } = useSelector(({ account }) => account);
    const { localAlert } = useSelector(({ status }) => status);
    const tokens = useSelector(state => selectTokensDetails(state));
    let fungibleTokens = Object.keys(tokens).map(key => tokens[key]).sort((a, b) => (a.symbol || '').localeCompare(b.symbol || ''));

    const availableNearBalance = balance?.available;
    const reservedNearForFees = parseNearAmount(WALLET_APP_MIN_AMOUNT);
    const availableNearToSend = getAvailableNearToSend(availableNearBalance, parseNearAmount(WALLET_APP_MIN_AMOUNT));

    const nearTokenData = {
        balance: availableNearToSend,
        symbol: 'NEAR'
    };
    
    fungibleTokens.unshift(nearTokenData);

    useEffect(() => {
        if (!accountId) {
            return;
        }

        dispatch(handleGetTokens());
    }, [accountId]);

    return (
        <SendContainerV2
            accountId={accountId}
            availableNearBalance={availableNearBalance}
            reservedNearForFees={reservedNearForFees}
            availableNearToSend={availableNearToSend}
            redirectTo={path => dispatch(redirectTo(path))}
            checkAccountAvailable={accountId => dispatch(checkAccountAvailable(accountId))}
            parseNearAmount={parseNearAmount}
            formatNearAmount={formatNearAmount}
            fungibleTokens={fungibleTokens}
            nearTokenData={nearTokenData}
            localAlert={localAlert}
            clearLocalAlert={() => dispatch(clearLocalAlert())}
            sendTokenTxFeeAmount={SEND_TOKEN_TX_FEE_AMOUNT}
        />
    );

};