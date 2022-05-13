import React from 'react';

import Breakdown from './css/Breakdown.css';
import Amount from './entry_types/Amount';
import {Token} from '../SendContainerV2'
const prefixTXEntryTitledId = (key: string) => `sendV2.TXEntry.title.${key}`;

type BalanceDetailsProps = {
    availableToSend: string;
    selectedToken: Token;
};

const BalanceDetails = ({
    availableToSend,
    selectedToken
}: BalanceDetailsProps) => {
    /* TODO: Add error state */
    return (
        <Breakdown className='available-to-send-breakdown'>
            <Amount
                data-test-id="sendPageSelectedTokenBalance"
                translateIdTitle={prefixTXEntryTitledId('availableToSend')}
                amount={availableToSend}
                symbol={selectedToken.onChainFTMetadata?.symbol}
                decimals={selectedToken.onChainFTMetadata?.decimals}
            />
        </Breakdown>
    );
};

export default BalanceDetails;
