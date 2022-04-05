import React from 'react'
import { Translate } from 'react-localize-redux'
import FormButton from '../../common/FormButton'
import { exchengeRateTranslation } from '../helpers'
import ImageContainer from '../ImageContainer'
import TextInfoSuccess from '../TextInfoSuccess'

const Success = ({
    inputValueFrom,
    to,
    symbol,
    miltiplier,
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
                +miltiplier / 10000
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
  )
}

export default Success