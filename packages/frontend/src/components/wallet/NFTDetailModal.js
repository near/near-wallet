import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import ArrowIcon from '../svg/ArrowIcon';


const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: coral;

    h2 {
        &.title {
            text-align: center;
            margin-top: 20px;
            color: #24272a;
        }
    }

    .row {
        width: 100%;
        max-width: 400px;
        margin: 40px auto;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;
        border-top: 1px solid #F0F0F1;

        :last-of-type {
            border-bottom: 1px solid #F0F0F1;
        }

        @media (max-width: 767px) {
            margin: 0 -25px;
            padding: 15px;
        }

        > span {
            :first-of-type {
                color: #A2A2A8;

                > span > span {
                    color: #3F4045;
                }
            }
        }
        &.sent-to > span {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > span {
                color: #3F4045;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;

                @media(max-width: 350px) {
                    max-width: 200px;
                }
                :first-of-type {
                    text-transform: capitalize;
                    color: #A2A2A8;
                }
            }
        }

        .amount {
            .value {
                font-weight: 700;
                color: #24272a;
                white-space: nowrap;
                display: flex;
                align-items: center;
                text-align: right;

                &.transferred {
                    .near-amount {
                        &::before {
                            content: '-'
                        }
                    }
                }
                &.received {
                    color: #00C08B;
                    .near-amount {
                        &::before {
                            content: '+'
                        }
                    }
                }
                .fiat-amount {
                    font-weight: 400;
                }
            }
        }
        .status {
            display: flex;
            align-items: center;
        }
    }

    button {
        &.gray-blue {
            width: 100% !important;
            max-width: 400px;
        }
    }
`;


export default function NFTDetailModal({ open, onClose }) {
    return (
        <StyledContainer className='small-centered'>
            <FormButton
                color='link go-back'
                onClick={() => onClose()}
            >
                <ArrowIcon />
            </FormButton>

        <h1>NFT Detail</h1>
        <h2>NFT Detail</h2>
        <h3>NFT Detail</h3>
        <p>NFT Detail</p>

        </StyledContainer>
    );
}
