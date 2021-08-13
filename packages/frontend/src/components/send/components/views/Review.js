import React from 'react';
import { Translate } from 'react-localize-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';

import classNames from '../../../../utils/classNames';
import FormButton from '../../../common/FormButton';
import Information from '../entry_types/Information';
import RawTokenAmount from '../RawTokenAmount';
import TransactionDetails from '../TransactionDetails';

const StyledContainer = styled.div`
    .information {
        background-color: #FAFAFA;
        border-radius: 8px;
        margin-bottom: 5px;
    }

    &:not(.sending-token) {
        .clickable {
            cursor: pointer;
        }
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
            line-break: anywhere;
            line-height: normal;
        }
    }
`;

const prefixTXEntryTitleId = (key) => `sendV2.TXEntry.title.${key}`;

const Review = ({
    onClickCancel,
    onClickContinue,
    amount,
    selectedToken,
    senderId,
    receiverId,
    estimatedFeesInNear,
    estimatedTotalInNear,
    sendingToken,
    onClickAmount,
    onClickReceiver,
    onClickSelectedToken
}) => {

    return (
        <StyledContainer className={classNames(['buttons-bottom', {'sending-token' : sendingToken === true}])}>
            <div className='header'>
                <Translate id='sendV2.review.title'/>
            </div>
            <div className='token-amount clickable' onClick={() => sendingToken !== true && onClickAmount()}>
                <Textfit mode='single' max={38}>
                    <RawTokenAmount
                        amount={amount}
                        symbol={selectedToken.symbol}
                        decimals={selectedToken.decimals}
                        showFiatAmountForNonNearToken={false}
                    />
                </Textfit>
            </div>
            <Information
                translateIdTitle={prefixTXEntryTitleId('from')}
                informationValue={senderId}
            />
            <Information
                translateIdTitle={prefixTXEntryTitleId('to')}
                informationValue={receiverId}
                onClick={() => sendingToken !== true && onClickReceiver()}
            />
            <TransactionDetails
                selectedToken={selectedToken}
                estimatedFeesInNear={estimatedFeesInNear}
                estimatedTotalInNear={estimatedTotalInNear}
                amount={amount}
                onTokenClick={() => sendingToken !== true && onClickSelectedToken()}
            />
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={onClickContinue}
                    disabled={sendingToken === true}
                    sending={sendingToken === true}
                >
                    <Translate id={`button.${sendingToken === 'failed' ? 'retry' : 'confirmAndSend'}`}/>
                </FormButton>
                <FormButton
                    disabled={sendingToken === true}
                    onClick={onClickCancel}
                    className='link'
                    color='gray'
                >
                    <Translate id='button.cancel'/>
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default Review;