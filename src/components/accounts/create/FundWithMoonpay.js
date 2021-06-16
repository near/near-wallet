import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import FormButton from '../../common/FormButton'
import MoonPayIcon from '../../svg/MoonPayIcon'
import { Mixpanel } from '../../../mixpanel'

const Container = styled.div`

    button {
        &.black {
            background-color: #111618 !important;
            margin-top: 45px !important;

            svg {
                width: 105px !important;
            }
        }
    }

    h3 {
        font-size: 20px !important;
    }

`

const FundWithMoonpay = ({ moonpaySignedURL }) => {

    return (
        <Container>
            <h3><Translate id='account.createImplicit.pre.moonPay.title'/></h3>
            <h2><Translate id='account.createImplicit.pre.moonPay.desc'/></h2>
            <FormButton
                linkTo='https://support.moonpay.com/'
                className='link normal underline'
                trackingId="CA Click Moonpay learn more"
            >
                <Translate id='button.learnMore' />
            </FormButton>
            <FormButton
                linkTo={moonpaySignedURL}
                color='black'
                onClick={() => Mixpanel.track("CA Click Fund with Moonpay")}
            >
                <Translate id='account.createImplicit.pre.moonPay.buyWith'/>
                <MoonPayIcon/>
            </FormButton>
        </Container>
    )
}

export default FundWithMoonpay