import BN from 'bn.js';
import { utils } from 'near-api-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { checkAccountAvailable, redirectTo } from '../../actions/account';
import { clearLocalAlert, showCustomAlert } from '../../actions/status';
import { handleGetTokens } from '../../actions/tokens';
import { selectTokensDetails } from '../../reducers/tokens';
import { EXPLORER_URL, SHOW_NETWORK_BANNER, wallet, WALLET_APP_MIN_AMOUNT } from '../../utils/wallet';
import SendContainerV2, { VIEWS } from './SendContainerV2';

const { parseNearAmount, formatNearAmount } = utils.format;

const getAvailableNearToSend = (availableBalance, reservedForFees) => {
    const availableToSendBN = new BN(availableBalance).sub(new BN(reservedForFees));
    return availableToSendBN.isNeg() ? '0' : availableToSendBN.toString();
};

const buildFungibleTokensArr = (tokens, availableNearToSend) => {
    return [
        {
            balance: availableNearToSend,
            symbol: 'NEAR'
        },
        ...Object.values(tokens)
    ];
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
    const [fungibleTokens, setFungibleTokens] = useState(() => buildFungibleTokensArr(tokens, availableNearToSend));

    useEffect(() => {
        setFungibleTokens(buildFungibleTokensArr(tokens, availableNearToSend));
    }, [tokens, availableNearToSend]);

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
            redirectTo={path => dispatch(redirectTo(path))}
            checkAccountAvailable={accountId => dispatch(checkAccountAvailable(accountId))}
            parseNearAmount={parseNearAmount}
            formatNearAmount={formatNearAmount}
            fungibleTokens={fungibleTokens}
            localAlert={localAlert}
            clearLocalAlert={() => dispatch(clearLocalAlert())}
            isMobile={isMobile}
            explorerUrl={EXPLORER_URL}
            showNetworkBanner={SHOW_NETWORK_BANNER}
            accountIdFromUrl={accountIdFromUrl}
            activeView={activeView}
            setActiveView={view => setActiveView(view)}
            estimatedTotalFees={estimatedTotalFees}
            estimatedTotalInNear={estimatedTotalInNear}
            handleSendToken={async (rawAmount, receiverId, contractName) => {
                setSendingToken(true);
                let result;

                try {
                    result = await wallet.fungibleTokens.transfer({
                        amount: rawAmount,
                        receiverId,
                        contractName
                    });
                } catch (e) {
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'walletErrorCodes.sendFungibleToken.error',
                        errorMessage: e.message,
                    }));
                    setSendingToken('failed');
                    return;
                }

                setActiveView(VIEWS.SUCCESS);
                setTransactionHash(result.transaction.hash);
            }}
            handleContinueToReview={async ({ token, receiverId, rawAmount }) => {
                // We can't estimate fees until we know which token is being sent, and to whom
                try {
                    if (token.symbol === 'NEAR') {
                        const [totalFees, totalNear] = await Promise.all([
                            wallet.fungibleTokens.getEstimatedTotalFees(),
                            wallet.fungibleTokens.getEstimatedTotalNearAmount(rawAmount)
                        ]);

                        setEstimatedTotalFees(totalFees);
                        setEstimatedTotalInNear(totalNear);
                    } else {
                        const totalFees = await wallet.fungibleTokens.getEstimatedTotalFees(token.contractName, receiverId);
                        setEstimatedTotalFees(totalFees);
                    }

                    setActiveView(VIEWS.REVIEW);
                } catch (e) {
                    dispatch(showCustomAlert({
                        errorMessage: e.message,
                        success: false,
                        messageCodeHeader: 'error',
                    }));
                }
            }}
            sendingToken={sendingToken}
            transactionHash={transactionHash}
        />
    );

}