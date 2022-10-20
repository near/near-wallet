import { utils } from 'near-api-js';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { EXPLORER_URL } from '../../config';
import useSortedTokens from '../../hooks/useSortedTokens';
import { Mixpanel } from '../../mixpanel/index';
import { checkAccountAvailable, redirectTo } from '../../redux/actions/account';
import { clearLocalAlert, showCustomAlert } from '../../redux/actions/status';
import { selectAccountId } from '../../redux/slices/account';
import {
    actions as ledgerActions
} from '../../redux/slices/ledger';
import { selectStatusLocalAlert } from '../../redux/slices/status';
import { selectNearTokenFiatValueUSD } from '../../redux/slices/tokenFiatValues';
import { selectAllowedTokens } from '../../redux/slices/tokens';
import { fungibleTokensService } from '../../services/FungibleTokens';
import isMobile from '../../utils/isMobile';
import { SHOW_NETWORK_BANNER } from '../../utils/wallet';
import { formatErrorBalance } from '../common/balance/helpers';
import SkeletonLoading from '../common/SkeletonLoading';
import SendContainerV2, { VIEWS } from './SendContainerV2';

const {
    checkAndHideLedgerModal
} = ledgerActions;

const { parseNearAmount, formatNearAmount } = utils.format;

const LoaderWrapper = styled.div`
    padding: 2.5rem 0.625rem 0.625rem;
    max-width: 31.25rem;
    margin: 0 auto;

    .animation {
        border-radius: 0.5rem;
    }
`;

const SendContainerWrapper = ({ match }) => {
    const accountIdFromUrl = match.params.accountId || '';
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);
    const localAlert = useSelector(selectStatusLocalAlert);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const [activeView, setActiveView] = useState(VIEWS.ENTER_AMOUNT);
    const [estimatedTotalFees, setEstimatedTotalFees] = useState('0');
    const [estimatedTotalInNear, setEstimatedTotalInNear] = useState('0');
    const [sendingToken, setSendingToken] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const allowedTokens = useSelector(selectAllowedTokens);
    const sortedTokens = useSortedTokens(allowedTokens);

    if (!sortedTokens.length) {
        return (
            <LoaderWrapper>
                <SkeletonLoading height="6.375rem" show />
            </LoaderWrapper>
        );
    }

    return (
        <SendContainerV2
            accountId={accountId}
            redirectTo={(path) => dispatch(redirectTo(path))}
            checkAccountAvailable={(accountId) => dispatch(checkAccountAvailable(accountId))}
            parseNearAmount={parseNearAmount}
            formatNearAmount={formatNearAmount}
            fungibleTokens={sortedTokens}
            localAlert={localAlert}
            clearLocalAlert={() => dispatch(clearLocalAlert())}
            isMobile={isMobile()}
            explorerUrl={EXPLORER_URL}
            showNetworkBanner={SHOW_NETWORK_BANNER}
            accountIdFromUrl={accountIdFromUrl}
            activeView={activeView}
            setActiveView={(view) => setActiveView(view)}
            estimatedTotalFees={estimatedTotalFees}
            estimatedTotalInNear={estimatedTotalInNear}
            nearTokenFiatValueUSD={nearTokenFiatValueUSD}
            handleSendToken={async (rawAmount, receiverId, contractName) => {
                setSendingToken(true);

                await Mixpanel.withTracking('SEND token',
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
                            errorMessage: formatErrorBalance(e.message),
                        }));
                        setSendingToken('failed');
                        return;
                    }
                );

                dispatch(checkAndHideLedgerModal());
            }}
            handleContinueToReview={async ({ token, receiverId, rawAmount }) => {
                try {
                    if (token.onChainFTMetadata?.symbol === 'NEAR') {
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

};

export default SendContainerWrapper;
