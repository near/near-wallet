import React from 'react';
import { Translate } from 'react-localize-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import SafeTranslate from '../../SafeTranslate';
import { VIEWS } from '../Swap';
import SelectTokenButton from './SelectTokenButton';

const FormFrom = styled.form`
    display: flex;
    flex-direction: column;
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
    }
    .outputText {
        text-align: right;
        padding: 20px 15px 0 15px;
        font-size: 16px;
        height: 64px;
        margin-top: 0;
        background-color: #F1F3F5;
        color: #A2A2A7;
        border-radius: 8px;
    }
    input.error {
        color: #fc5b5b;
    }
`;

const SwapToForm = ({
    setActiveView,
    maxValue,
    amountToken,
    activeTokenTo,
}) => {
    return (
        <FormFrom>
            <div className="flex">
                <div className="title">
                    <Translate id="swapNear.to" />
                </div>
                <div
                    className="maxTitle"
                >
                    <SafeTranslate
                        id="swapNear.max"
                        data={{
                            amount: maxValue.numToShow,
                            symbol: activeTokenTo?.onChainFTMetadata?.symbol,
                        }}
                    />
                </div>
            </div>
            <div className="flex-input">
                {activeTokenTo && (
                    <SelectTokenButton
                        token={activeTokenTo}
                        onClick={() => setActiveView(VIEWS.SELECT_TOKEN_TO)}
                    />
                )}
                <div className='outputText'>
                    {amountToken ? amountToken : '0'}
                </div>
            </div>
        </FormFrom>
    );
};

export default withRouter(SwapToForm);
