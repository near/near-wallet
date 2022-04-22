import { utils } from 'near-api-js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EXPLORER_URL } from '../../config';
import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { Mixpanel } from '../../mixpanel/index';
import { redirectTo } from '../../redux/actions/account';
import { showCustomAlert } from '../../redux/actions/status';
import { selectAccountId } from '../../redux/slices/account';
import {
    actions as ledgerActions
} from '../../redux/slices/ledger';
import { selectNearTokenFiatValueUSD } from '../../redux/slices/tokenFiatValues';
import { actions as tokensActions } from '../../redux/slices/tokens';
import { fungibleTokensService } from '../../services/FungibleTokens';
import isMobile from '../../utils/isMobile';
import { SHOW_NETWORK_BANNER } from '../../utils/wallet';
import DonateContainerV2, { VIEWS } from './DonateContainerV2';

const {
    checkAndHideLedgerModal
} = ledgerActions;

const { parseNearAmount, formatNearAmount } = utils.format;
const { fetchTokens } = tokensActions;

export function DoanteContainerWrapper() {
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const [activeView, setActiveView] = useState(VIEWS.ENTER_AMOUNT);
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
        <DonateContainerV2
            accountId={accountId}
            redirectTo={(path) => dispatch(redirectTo(path))}
            parseNearAmount={parseNearAmount}
            formatNearAmount={formatNearAmount}
            fungibleTokens={fungibleTokensList}
            isMobile={isMobile()}
            explorerUrl={EXPLORER_URL}
            showNetworkBanner={SHOW_NETWORK_BANNER}
            activeView={activeView}
            setActiveView={(view) => setActiveView(view)}
            nearTokenFiatValueUSD={nearTokenFiatValueUSD}
            handleSendToken={async (rawAmount, receiverId, contractName) => {
                setSendingToken(true);

                await Mixpanel.withTracking('Donate-to-Ukraine token',
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
            sendingToken={sendingToken}
            transactionHash={transactionHash}
        />
    );

}
