import React from 'react';

import Breakdown from './css/Breakdown.css';
import Amount from './entry_types/Amount';

const prefixTXEntryTitledId = (key) => `sendV2.TXEntry.title.${key}`;

const BalanceDetails = ({ 
    availableToSend,
    selectedToken
}) => {

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