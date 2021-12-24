import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EXPLORER_URL, WRAP_NEAR_CONTRACT_ID } from '../../config';
import { useNear } from '../../hooks/fungibleTokensIncludingNEAR';
import { Mixpanel } from '../../mixpanel/index';
import { checkAndHideLedgerModal, redirectTo } from '../../redux/actions/account';
import { showCustomAlert } from '../../redux/actions/status';
import { selectAccountId } from '../../redux/slices/account';
import { actions as tokensActions, selectOneTokenWithMetadataForAccountId } from '../../redux/slices/tokens';
import { wrappedNearTokenService } from '../../services/WrappedNearToken';
import isMobile from '../../utils/isMobile';
import { SHOW_NETWORK_BANNER } from '../../utils/wallet';
import WrapNearContainer, { VIEWS } from './WrapNearContainer';

const { fetchOwnedTokensForContractWithMeta } = tokensActions;

export const ExecutionStatusEnum = { "NotExecuting": 1, "Executing": 2, "Failed": 3 }


export function WrapNearContainerWrapper({ match }) {
    const defaultWrapping = match.params.wrapping === "unwrap" ? false : true;
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);
    const [activeView, setActiveView] = useState(VIEWS.ENTER_AMOUNT);
    const [estimatedTotalFees, setEstimatedTotalFees] = useState('0');
    const [estimatedTotalInNear, setEstimatedTotalInNear] = useState('0');
    const [isWrapping, setIsWrapping] = useState(defaultWrapping);

    const [executionStatus, setExecutionStatus] = useState(ExecutionStatusEnum.NotExecuting);
    const [transactionHash, setTransactionHash] = useState(null);

    const wNearContractName = WRAP_NEAR_CONTRACT_ID
    const nearToken = useNear();
    const wNearToken = useSelector((state) => selectOneTokenWithMetadataForAccountId(state, { accountId, contractName: wNearContractName }))


    useEffect(() => {
        if (!accountId) {
            return;
        }
        dispatch(fetchOwnedTokensForContractWithMeta({ accountId, contractName: wNearContractName }));
    }, [accountId]);

    const handleWrapToken = async (rawAmount) => {
        setExecutionStatus(ExecutionStatusEnum.Executing);

        await Mixpanel.withTracking("Wrap Near",
            async () => {
                let result = null;
                if (isWrapping) {
                    result = await wrappedNearTokenService.wrapNear({
                        accountId,
                        amount: rawAmount
                    });
                } else {
                    result = await wrappedNearTokenService.unwrapNear({
                        accountId,
                        amount: rawAmount
                    });
                }
                setTransactionHash(result.transaction.hash);
                setActiveView(VIEWS.SUCCESS);

                const id = Mixpanel.get_distinct_id();
                Mixpanel.identify(id);
                Mixpanel.people.set({ last_wrap_token: new Date().toString() });
            },
            (e) => {
                dispatch(showCustomAlert({
                    success: false,
                    messageCodeHeader: 'error',
                    messageCode: 'walletErrorCodes.wrapNear.error',
                    errorMessage: e.message,
                }));
                console.log(e.stack)
                setExecutionStatus(ExecutionStatusEnum.Failed);
                return;
            }
        );

        dispatch(checkAndHideLedgerModal());
    }


    const handleContinueToReview = async ({ token, rawAmount }) => {
        try {
            if (token.symbol === 'NEAR') {
                const [totalFees, totalNear] = await Promise.all([
                    wrappedNearTokenService.getEstimatedTotalFeesForWrapping({ accountId: accountId }),
                    wrappedNearTokenService.getEstimatedTotalNearAmountForWrapping({ amount: rawAmount, accountId: accountId })
                ]);

                setEstimatedTotalFees(totalFees);
                setEstimatedTotalInNear(totalNear);
            } else {
                const totalFees = await wrappedNearTokenService.getEstimatedTotalFeesForUnWrapping();
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
    }

    return (
        <WrapNearContainer
            nearToken={nearToken}
            wNearToken={wNearToken}
            activeView={activeView}
            redirectTo={path => dispatch(redirectTo(path))}
            accountId={accountId}
            showNetworkBanner={SHOW_NETWORK_BANNER}
            setActiveView={setActiveView}
            isWrapping={isWrapping}
            handleWrapToken={handleWrapToken}
            estimatedTotalFees={estimatedTotalFees}
            estimatedTotalInNear={estimatedTotalInNear}
            executionStatus={executionStatus}
            explorerUrl={EXPLORER_URL}
            transactionHash={transactionHash}
            setIsWrapping={setIsWrapping}
            handleContinueToReview={handleContinueToReview}
            isMobile={isMobile}
        />
    );

}


