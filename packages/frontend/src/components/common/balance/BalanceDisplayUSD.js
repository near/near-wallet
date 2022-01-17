import React from 'react';
import { Translate } from 'react-localize-redux';

import AlertRoundedIcon from '../../svg/AlertRoundedIcon';
import Tooltip from '../Tooltip';
import { getRoundedBalanceInFiat, formatWithCommas } from './helpers';

const BalanceDisplayUSD = ({
    amount,
    showAlmostEqualSignUSD = true,
    showSignUSD = true,
    showSymbolUSD = true,
    nearTokenFiatValueUSD,
    isNear = true,
    tokenMeta: {tokenPrice, isWhiteListed} = {}
}) => {

    const roundedBalanceInUSD = getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD);
    const USDSymbol = 'USD';
    const roundedBalanceInUSDIsBelowThreshold = roundedBalanceInUSD === '< $0.01';

    if (!isNear) {
        return (
            <>
                <div style={{color: isWhiteListed ? '' : '#FF585D', display: 'flex', whiteSpace: 'normal'}}>
                    { tokenPrice 
                        ? `≈ $${formatWithCommas(tokenPrice * amount)} ${USDSymbol}`
                        : <Translate id='tokenBox.priceUnavailable'/>
                    }
                    {!isWhiteListed && <Tooltip translate={'staking.validator.notWhiteListedWarning'}>
                        <AlertRoundedIcon/>
                    </Tooltip>}
                </div>
                
            </>
        );
    }

    if (roundedBalanceInUSD) {
        return (
            <>
                {!roundedBalanceInUSDIsBelowThreshold &&
                    <>
                        {showAlmostEqualSignUSD && '≈ '}
                        {showSignUSD && <>$</>}
                    </>
                }
                {formatWithCommas(roundedBalanceInUSD)}
                {showSymbolUSD && ` ${USDSymbol}`}
            </>
        );
    } else if (roundedBalanceInUSD === 0) {
        return (
            <>
                {showSignUSD && <>$</>}0
            </>
        );
    } else {
        return (
            <>
                — {USDSymbol}
            </>
        );
    }
};

export default BalanceDisplayUSD;