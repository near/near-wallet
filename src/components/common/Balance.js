import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { 
    formatNearAmount,
    showInYocto
} from '../../utils/balance';
import NEARBalanceInUSD from './NEARBalanceInUSD';

const StyledContainer = styled.div`
    white-space: nowrap;
    line-height: normal;

    .dots {
        color: #4a4f54;
        margin: 0 12px 0 0;

        :after {
            content: '.';
            animation: link 1s steps(5, end) infinite;

            @keyframes link {
                0%, 20% {
                    color: rgba(0,0,0,0);
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                40% {
                    color: #4a4f54;
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                60% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 rgba(0,0,0,0);
                }
                80%, 100% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 #4a4f54;
                }
            }
        }
    }

    .usd-amount {
        color: #A2A2A8;
    }
`;

const Balance = ({
    amount,
    symbol = true,
    className,
    includeBalanceInUSD = true
}) => {

    const amountoShow = amount && formatNearAmount(amount);
    const NEARSymbol = 'NEAR';

    return (
        <StyledContainer title={showInYocto(amount)} className={className}>
            {amount
                ? `${amountoShow}${symbol !== false ? ` ${NEARSymbol}` : ``}`
                : <div className="dots"><Translate id='loadingNoDots'/></div>
            }
            {includeBalanceInUSD &&
                <div className='usd-amount'>
                    <NEARBalanceInUSD
                        amount={amount}
                    />
                </div>
            }
        </StyledContainer>
    );
};

export default Balance;
