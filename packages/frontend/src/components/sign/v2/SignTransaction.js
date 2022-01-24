import BN from 'bn.js';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Balance from '../../common/balance/Balance';
import FormButton from '../../common/FormButton';
import Tooltip from '../../common/Tooltip';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    > .balance {
        text-align: center;
        margin: 30px 0;
        .near-amount {
            font-size: 31px;
            font-weight: 600;
            color: #272729;
        }
        .fiat-amount {
            color: #72727A;
            font-size: 16px;
        }
    }

    > .account {
        width: 100%;
        border-top: 1px solid #F0F0F1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        color: #72727A;

        .right {
            text-align: right;
            margin-left: 20px;
            
            .account-id {
                color: #272729;
                font-weight: 600;
                word-break: break-all;
            }

            .balance {
                color: #A2A2A8;
                margin-top: 5px;
            }
        }

        .left {
            text-align: left;

            .link {
                font-weight: normal;
            }
        }

        &.from {
            .near-amount {
                color: #72727A;
            }

            &.no-border {
                border-top: none;
            }
        }

        &.fees {
            .left {
                display: flex;
                align-items: center;
            }
            .near-amount {
                color: #3F4045;
            }
            .fiat-amount {
                color: #A2A2A8;
                font-size: 14px;
                margin-top: 5px;
            }
        }
    }
`;

export default ({
    transferAmount,
    sender,
    estimatedFees,
    availableBalance,
    onClickEditAccount
}) => {
    const isTransferTransaction = new BN(transferAmount).gt(new BN(0));
    return (
        <StyledContainer className='transfer-amount brs-8 bsw-l'>
            {isTransferTransaction &&
                <Balance
                    amount={transferAmount}
                    showAlmostEqualSignUSD={false}
                    showSymbolUSD={false}
                />
            }
            <div className={`account from ${!isTransferTransaction ? 'no-border' : ''}`}>
                <div className='left'>
                    <Translate id='transfer.from' />
                    {' • '}
                    <FormButton
                        className="link"
                        onClick={onClickEditAccount}
                    >
                        <Translate id="button.edit" />
                    </FormButton>
                </div>
                <div className='right'>
                    <div className='account-id'>{sender}</div>
                    <Balance
                        amount={availableBalance}
                        showBalanceInUSD={false}
                    />
                </div>
            </div>
            <div className='account fees'>
                <div className='left'>
                    <Translate id='transfer.estimatedFees' />
                    <Tooltip translate='sendV2.translateIdInfoTooltip.estimatedFees' />
                </div>
                <div className='right'>
                    <Balance
                        amount={estimatedFees}
                    />
                </div>
            </div>
        </StyledContainer>
    );
};