import { utils } from 'near-api-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { checkAccountAvailable, redirectTo } from '../../actions/account';
import { checkAndHideLedgerModal } from '../../actions/account';
import { clearLocalAlert, showCustomAlert } from '../../actions/status';
import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { Mixpanel } from '../../mixpanel/index';
import { actions as tokensActions } from '../../redux/slices/tokens';
import { fungibleTokensService } from '../../services/FungibleTokens';
import { selectNearTokenFiatValueUSD } from '../../slices/tokenFiatValues';
import isMobile from '../../utils/isMobile';
import { EXPLORER_URL, SHOW_NETWORK_BANNER } from '../../utils/wallet';
import SendContainerV2, { VIEWS } from './SendContainerV2';

const { parseNearAmount, formatNearAmount } = utils.format;
const { fetchTokens } = tokensActions;

export function SendContainerWrapper({ match }) {
    const accountIdFromUrl = match.params.accountId || '';
    const dispatch = useDispatch();
    const { accountId } = useSelector(({ account }) => account);
    const { localAlert } = useSelector(({ status }) => status);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);

    const [activeView, setActiveView] = useState(VIEWS.ENTER_AMOUNT);
    const [estimatedTotalFees, setEstimatedTotalFees] = useState('0');
    const [estimatedTotalInNear, setEstimatedTotalInNear] = useState('0');
    const [sendingToken, setSendingToken] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const fungibleTokensList = useFungibleTokensIncludingNEAR();

    useEffect(() => {
        if (!accountId) {
            return;
        }

        dispatch(fetchTokens({ accountId }));
    }, [accountId]);

    return (
        <SendContainerV2
            accountId={accountId}
            redirectTo={path => dispatch(redirectTo(path))}
            checkAccountAvailable={accountId => dispatch(checkAccountAvailable(accountId))}
            parseNearAmount={parseNearAmount}
            formatNearAmount={formatNearAmount}
            fungibleTokens={fungibleTokensList}
            localAlert={localAlert}
            clearLocalAlert={() => dispatch(clearLocalAlert())}
            isMobile={isMobile()}
            explorerUrl={EXPLORER_URL}
            showNetworkBanner={SHOW_NETWORK_BANNER}
            accountIdFromUrl={accountIdFromUrl}
            activeView={activeView}
            setActiveView={view => setActiveView(view)}
            estimatedTotalFees={estimatedTotalFees}
            estimatedTotalInNear={estimatedTotalInNear}
            nearTokenFiatValueUSD={nearTokenFiatValueUSD}
            handleSendToken={async (rawAmount, receiverId, contractName) => {
                setSendingToken(true);

                await Mixpanel.withTracking("SEND token",
                    async () => {
                        const result = await fungibleTokensService.transfer({
                            accountId,
                            amount: rawAmount,
                            receiverId,
                            contractName
                        });

                        setTransactionHash(result.transaction.hash);
                        setActiveView(VIEWS.SUCCESS);

                        const id = Mixpanel.get_distinct_id();
                        Mixpanel.identify(id);
                        Mixpanel.people.set({ last_send_token: new Date().toString() });
                    },
                    (e) => {
                        dispatch(showCustomAlert({
                            success: false,
                            messageCodeHeader: 'error',
                            messageCode: 'walletErrorCodes.sendFungibleToken.error',
                            errorMessage: e.message,
                        }));
                        setSendingToken('failed');
                        return;
                    }
                );

                dispatch(checkAndHideLedgerModal());
            }}
            handleContinueToReview={async ({ token, receiverId, rawAmount }) => {
                try {
                    if (token.symbol === 'NEAR') {
                        const [totalFees, totalNear] = await Promise.all([
                            fungibleTokensService.getEstimatedTotalFees(),
                            fungibleTokensService.getEstimatedTotalNearAmount({ amount: rawAmount })
                        ]);

                        setEstimatedTotalFees(totalFees);
                        setEstimatedTotalInNear(totalNear);
                    } else {
                        const totalFees = await fungibleTokensService.getEstimatedTotalFees({
                            accountId: receiverId,
                            contractName: token.contractName,
                        });
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