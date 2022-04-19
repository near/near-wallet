<<<<<<< HEAD
import React from 'react'
import { Translate } from 'react-localize-redux'
import FormButton from '../../common/FormButton'
import { exchengeRateTranslation } from '../helpers'
import ImageContainer from '../ImageContainer'
import TextInfoSuccess from '../TextInfoSuccess'
=======
import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import { exchengeRateTranslation } from '../helpers';
import ImageContainer from '../ImageContainer';
import TextInfoSuccess from '../TextInfoSuccess';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

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
            valueTo={exchengeRateTranslation(
                to,
                +inputValueFrom,
                +multiplier / 10000
            )}
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
<<<<<<< HEAD
  )
}

export default Success
=======
  );
};

export default Success;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
