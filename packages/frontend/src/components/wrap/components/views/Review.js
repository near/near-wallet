import React from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';
import FormButton from '../../../common/FormButton';
import { ExecutionStatusEnum } from "../../WrapNearContainerWrapper";
import AmountWithIcon from '../AmountWithIcon';
import RawTokenAmount from '../RawTokenAmount';
import TransactionDetails from '../TransactionDetails';

const StyledContainer = styled.div`
    .information {
        background-color: #FAFAFA;
        border-radius: 8px;
        margin-bottom: 5px;
    }

    .clickable {
        cursor: pointer;
    }

    .token-amount {
        font-size: 48px;
        font-weight: 600;
        color: #272729;
        text-align: center;
        margin: 40px 0;

        @media (max-width: 767px) {
            font-size: 38px;
        }

        > div {
            white-space: normal;
            word-break: break-all;
            line-height: normal;
        }
    }
`;
const prefixTXEntryTitledId = (key) => `wrapNear.review.TxEntry.title.${key}`;

const Review = ({
    onClickCancel,
    onClickContinue,
    amount,
    receiveRawAmount,
    selectedToken,
    receiveToken,
    estimatedFeesInNear,
    estimatedTotalInNear,
    wrappingToken,
    executionStatus,
    onClickAmount,
}) => {
    const titleId = wrappingToken ? "wrapNear.review.wrappingTitle" : "wrapNear.review.unwrappingTitle"

    return (
        <StyledContainer className="buttons-bottom">
            <div className='header'>
                <Translate id={titleId} />
            </div>
            <div className='token-amount clickable' onClick={() => onClickAmount()}>
                <Textfit mode='single' max={38}>
                    <RawTokenAmount
                        amount={amount}
                        symbol={selectedToken.symbol}
                        decimals={selectedToken.decimals}
                        showFiatAmountForNonNearToken={false}
                    />
                </Textfit>
            </div>

            <AmountWithIcon
                className="information"
                translateIdTitle={prefixTXEntryTitledId('sendToken')}
                symbol={selectedToken.symbol}
                icon={selectedToken.icon}
                amount={amount}
                decimals={selectedToken.decimals}
            />
            <AmountWithIcon
                className="information"
                translateIdTitle={prefixTXEntryTitledId('receiveToken')}
                symbol={receiveToken.symbol}
                icon={receiveToken.icon}
                amount={receiveRawAmount}
                decimals={receiveToken.decimals}
            />

            <TransactionDetails
                selectedToken={selectedToken}
                estimatedFeesInNear={estimatedFeesInNear}
                estimatedTotalInNear={estimatedTotalInNear}
                amount={amount}
            />
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={onClickContinue}
                    disabled={executionStatus === ExecutionStatusEnum.Executing}
                    sending={executionStatus === ExecutionStatusEnum.Executing}
                    data-test-id="wrapNearPageConfirmButton"
                >
                    <Translate id={`button.${executionStatus === ExecutionStatusEnum.Failed ? 'retry' : 'confirmAndSend'}`} />
                </FormButton>
                <FormButton
                    disabled={executionStatus === ExecutionStatusEnum.Executing}
                    onClick={onClickCancel}
                    className='link'
                    color='gray'
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default Review;