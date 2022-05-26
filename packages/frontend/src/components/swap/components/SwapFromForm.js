import React from 'react';
import { Translate } from 'react-localize-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import SafeTranslate from '../../SafeTranslate';
import { VIEWS } from '../Swap';
import SelectTokenButton from './SelectTokenButton';

const FromForm = styled.form`
    display: flex;
    flex-direction: column;
    margin: 34px 0 0 0;
    padding: 8px 16px 16px;
    background-color: #fbfcfd;
    border: 1px solid #eceef0;
    border-radius: 8px;
    div.flex {
        display: flex;
        justify-content: space-between;
        margin-top: 28px;
    }
    div.flex-input {
        display: grid;
        grid-template-columns: 184px 1fr;
        column-gap: 16px;
        margin-top: 16px;
        @media screen and (max-width: 767px) {
            grid-template-columns: 1fr 1fr;
        }
    }
    div.title {
        margin-left: 15px;
        color: #787f85;
    }
    div.maxTitle {
        font-style: italic;
        color: #2f98f3;
        cursor: pointer;
        :hover {
            text-decoration: underline;
        }
    }
    input.input-text {
        text-align: right;
        padding: 0 15px 0 15px;
        height: 64px;
        margin-top: 0;
        background-color: #F1F3F5;

        :focus {
            background-color: #FFFFFF;
        }
    }
    input.error {
        color: #fc5b5b;
    }
`;

const SwapFromForm = ({
    setActiveView,
    maxValue,
    amountToken,
    setAmountToken,
    activeTokenFrom,
    error,
}) => {
    return (
        <FromForm>
            <div className="flex">
                <div className="title">
                    <Translate id="swap.from" />
                </div>
                <div
                    className="maxTitle"
                    onClick={() => {
                        setAmountToken(maxValue.fullNum);
                    }}
                >
                    <SafeTranslate
                        id="swap.max"
                        data={{
                            amount: maxValue.numToShow,
                            symbol: activeTokenFrom?.onChainFTMetadata?.symbol,
                        }}
                    />
                </div>
            </div>
            <div className="flex-input">
                {activeTokenFrom && (
                    <SelectTokenButton
                        token={activeTokenFrom}
                        onClick={() => setActiveView(VIEWS.SELECT_TOKEN_FROM)}
                    />
                )}
                <input
                    type="number"
                    className={`input-text ${error ? 'error' : ''}`}
                    onChange={(e) => {
                        e.preventDefault();
                        setAmountToken(e.target.value);
                    }}
                    value={amountToken ? amountToken : ''}
                    placeholder="0"
                    maxLength="18"
                />
            </div>
        </FromForm>
    );
};

export default withRouter(SwapFromForm);
