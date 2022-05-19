import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import { exchangeRateTranslation } from '../helpers';
import ImageContainer from '../ImageContainer';
import TextInfoSuccess from '../TextInfoSuccess';

const Success = ({
    inputValueFrom,
    to,
    symbol,
    multiplier,
    handleBackToSwap
}) => {
  return (
    <>
        <ImageContainer />
        <TextInfoSuccess
            valueFrom={inputValueFrom}
            valueTo={exchangeRateTranslation({
                token: to,
                balance: + inputValueFrom,
                exchangeRate: +multiplier / 10000
            })}
            symbol={symbol}
        />
        <div className="buttons-bottom-buttons">
            <FormButton
                type="submit"
                data-test-id="sendMoneyPageSubmitAmountButton"
                onClick={handleBackToSwap}
            >
                <Translate id="button.backToSwap" />
            </FormButton>
            <FormButton
                type="button"
                className="link"
                color="gray"
                linkTo="/"
            >
                <Translate id="button.ToMaine" />
            </FormButton>
        </div>
    </>      
  );
};

export default Success;
