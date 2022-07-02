import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

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
    sender,
    fromLabelId
}) => {
    return (
        <StyledContainer className='transfer-amount brs-8 bsw-l'>

            <div className={'account from no-border'}>
                <Translate id={fromLabelId || 'transfer.from'} />
                <div className='right'>
                    <div className='account-id'>{sender}</div>
                </div>
            </div>
        </StyledContainer>
    );
};
