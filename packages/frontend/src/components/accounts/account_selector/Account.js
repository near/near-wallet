import React, { useState } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../../utils/theme';
import Balance from '../../common/balance/Balance';
import ClickToCopy from '../../common/ClickToCopy';
import CopyIcon from '../../svg/CopyIcon';
import EyeIcon from './EyeIcon';

const StyledContainer = styled.div`
    border-radius: 8px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    color: #72727A;
    margin: 8px 0;
    background: ${COLORS.darkGray};
    
    > .details {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
    }

    > .copy {
        margin: 0 8px 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    > .copy,
    > svg {
        cursor: pointer;
        min-width: 32px;
        min-height: 32px;
        > rect {
            fill: ${COLORS.darkGray};
        }
    }

    :hover {
        background-color: ${COLORS.darkGray};
    }

    .account-id, .balance {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .balance {
        min-height: 20px;
    }

    .account-id {
        font-weight: 600;
        line-height: 170%;
    }

    &.active {
        background: ${COLORS.darkGray};
        border: 1px solid ${COLORS.green};
        cursor: default;

        .account-id {
            color: ${COLORS.lightText};
        }

        .balance {
            color: ${COLORS.lightText};
        }

        > svg {
            rect {
                fill: ${COLORS.darkGray};
            }
        }
    }
`;

const Account = (
    {
        active,
        accountId,
        balance,
        defaultShowBalance,
        onSelectAccount,
        onToggleShowBalance = () => {},
        showBalanceInUSD
    }
) => {
    const [showBalance, setShowBalance] = useState(defaultShowBalance);

    return (
        <StyledContainer className={active ? 'active' : ''} onClick={onSelectAccount}>
            <div className='details'>
                <div className='account-id'>{accountId}</div>
                <div className='balance'>
                    {showBalance
                        ? (
                            <Balance
                                amount={balance}
                                showBalanceInUSD={showBalanceInUSD}
                                showBalanceInNEAR={!showBalanceInUSD}
                                showAlmostEqualSignUSD={false}
                            />
                        )
                        : '••••••'
                    }
                </div>
            </div>
            <ClickToCopy
                copy={accountId}
                className='copy'
                compact={true}
                onClick={(e) => e.stopPropagation()}
            >
                <CopyIcon color={COLORS.lightText} />
            </ClickToCopy>
            <EyeIcon
                show={showBalance}
                onClick={(e) => {
                    setShowBalance(!showBalance);
                    onToggleShowBalance();
                    e.stopPropagation();
                }}
                color={COLORS.lightText}
            />
        </StyledContainer>
    );
};

export default Account;
