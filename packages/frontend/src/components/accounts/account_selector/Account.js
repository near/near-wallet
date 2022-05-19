import React, { useState } from 'react';
import styled from 'styled-components';

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
    }

    :hover {
        background-color: #FAFAFA;

        > svg {
            rect {
                fill: white;
            }
        }
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
        border: 1px solid #8FCDFF;
        background-color: #F0F9FF;
        cursor: default;

        .account-id {
            color: #001729;
        }

        .balance {
            color: #0072CE;
        }

        > svg {
            rect {
                fill: #D6EDFF;
            }
        }
    }
`;

export default ({
    active,
    accountId,
    balance,
    defaultShowBalance,
    onSelectAccount,
    onToggleShowBalance = () => {},
    showBalanceInUSD
}) => {
    const [showBalance, setShowBalance] = useState(defaultShowBalance);
    return (
        <StyledContainer className={active ? 'active' : ''} onClick={onSelectAccount}>
            <div className='details'>
                <div className='account-id'>{accountId}</div>
                <div className='balance'>
                    {showBalance
                        ? <Balance
                            amount={balance}
                            showBalanceInUSD={showBalanceInUSD}
                            showBalanceInNEAR={!showBalanceInUSD}
                            showAlmostEqualSignUSD={false}
                        />
                        : '••••••'
                    }
                </div>
            </div>
            <ClickToCopy copy={accountId} className='copy' onClick={(e) => e.stopPropagation()}>
                <CopyIcon color='#2B9AF4' />
            </ClickToCopy>
            <EyeIcon
                show={showBalance}
                onClick={(e) => {
                    setShowBalance(!showBalance);
                    onToggleShowBalance();
                    e.stopPropagation();
                }}
            />
        </StyledContainer>
    );
};
