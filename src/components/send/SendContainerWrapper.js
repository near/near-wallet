import BN from 'bn.js';
import { utils } from 'near-api-js';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    redirectTo,
    checkAccountAvailable
} from '../../actions/account';
import { clearLocalAlert, showCustomAlert } from '../../actions/status';
import { handleGetTokens } from '../../actions/tokens';
import { selectTokensDetails } from '../../reducers/tokens';
import {
    WALLET_APP_MIN_AMOUNT,
    EXPLORER_URL,
    wallet,
    SHOW_NETWORK_BANNER
} from '../../utils/wallet';
import SendContainerV2 from './SendContainerV2';

const VIEWS = {
    ENTER_AMOUNT: 'enterAmount',
    SELECT_TOKEN: 'selectToken',
    ENTER_RECEIVER: 'enterReceiver',
    REVIEW: 'review',
    SUCCESS: 'success'
};

const FTMethods = wallet.fungibleTokens;

const { parseNearAmount, formatNearAmount } = utils.format;

const getAvailableNearToSend = (availableBalance, reservedForFees) => {
    const availableToSendBN = new BN(availableBalance).sub(new BN(reservedForFees));
    return availableToSendBN.isNeg() ? '0' : availableToSendBN.toString();
};

export function SendContainerWrapper({ match }) {
    const accountIdFromUrl = match.params.accountId || '';
    const dispatch = useDispatch();
    const { accountId, balance } = useSelector(({ account }) => account);
    const { localAlert, isMobile } = useSelector(({ status }) => status);
    const tokens = useSelector(state => selectTokensDetails(state));

    const availableNearBalance = balance?.available;
    const reservedNearForFees = parseNearAmount(WALLET_APP_MIN_AMOUNT);
    const availableNearToSend = getAvailableNearToSend(availableNearBalance, parseNearAmount(WALLET_APP_MIN_AMOUNT));

    const [activeView, setActiveView] = useState(VIEWS.ENTER_AMOUNT);
    const [estimatedTotalFees, setEstimatedTotalFees] = useState('0');
    const [estimatedTotalInNear, setEstimatedTotalInNear] = useState('0');
    const [sendingToken, setSendingToken] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);

    const fungibleTokens = [
        {
            balance: availableNearToSend,
            symbol: 'NEAR'
        },
        ...Object.values(tokens)
    ];

    useEffect(() => {
        if (!accountId) {
            return;
        }

        dispatch(handleGetTokens());
    }, [accountId]);

    const handleSendToken = async (parsedAmount, receiverId, contractName) => {
        setSendingToken(true);
        let result;

        try {
            result = await FTMethods.transfer({ 
                parsedAmount,
                receiverId,
                contractName
            });
        } catch(e) {
            showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.sendFungibleToken.error',
                errorMessage: e.message,
            });
            setSendingToken('failed');
            return;
        }

        setActiveView(VIEWS.SUCCESS);
        setTransactionHash(result.transaction.hash);
    };

    return (
        <SendContainerV2
            accountId={accountId}
            FTMethods={FTMethods}
            availableNearBalance={availableNearBalance}
            reservedNearForFees={reservedNearForFees}
            redirectTo={path => dispatch(redirectTo(path))}
            checkAccountAvailable={accountId => dispatch(checkAccountAvailable(accountId))}
            parseNearAmount={parseNearAmount}
            formatNearAmount={formatNearAmount}
            fungibleTokens={fungibleTokens}
            localAlert={localAlert}
            clearLocalAlert={() => dispatch(clearLocalAlert())}
            showCustomAlert={alert => dispatch(showCustomAlert(alert))}
            isMobile={isMobile}
            explorerUrl={EXPLORER_URL}
            showNetworkBanner={SHOW_NETWORK_BANNER}
            accountIdFromUrl={accountIdFromUrl}
            VIEWS={VIEWS}
            activeView={activeView}
            setActiveView={view => setActiveView(view)}
            estimatedTotalFees={estimatedTotalFees}
            setEstimatedTotalFees={fees => setEstimatedTotalFees(fees)}
            estimatedTotalInNear={estimatedTotalInNear}
            setEstimatedTotalInNear={amount => setEstimatedTotalInNear(amount)}
            handleSendToken={handleSendToken}
            sendingToken={sendingToken}
            transactionHash={transactionHash}
        />
    );

};