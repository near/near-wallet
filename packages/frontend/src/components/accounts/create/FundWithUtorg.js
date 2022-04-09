import {utils} from 'near-api-js';
import { stringifyUrl } from 'query-string';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { UTORG_ORDER_URL } from '../../../config';
import UtorgLogo from '../../../images/utorg-logo.png';
import { Mixpanel } from '../../../mixpanel';
import FormButton from '../../common/FormButton';

const Container = styled.div`

    button {
        &.black {
            background-color: #111618 !important;
            margin-top: 45px !important;

            img {
                margin: -3px 0 0 10px !important;
                height: 40% !important;
            }
        }
    }

    h3 {
        font-size: 20px !important;
    }

`;

export function buildUtorgPayLink(accountId, amount, amountFiat, currencyFiat) {
    let uri = {
        url: UTORG_ORDER_URL,
        query: {
            currency: 'NEAR',
        }
    };

    if (accountId) {
        uri.url += `${accountId}/`;
    }
    if (amount) {
        uri.query.amount = utils.format.formatNearAmount(amount);
    } else if (amountFiat && currencyFiat) {
        uri.query.paymentAmount = amountFiat;
        uri.query.paymentCurrency = currencyFiat;
    }

    return stringifyUrl(uri);
}

const FundWithUtorg = ({ accountId, amount }) => {
    return (
        <Container>
            <h3><Translate id='account.createImplicit.pre.utorg.title'/></h3>
            <h2><Translate id='account.createImplicit.pre.utorg.desc'/></h2>
            <FormButton
                linkTo='https://utorg.pro/faq/'
                className='link normal underline'
                trackingId="CA Click Utorg learn more"
            >
                <Translate id='button.learnMore' />
            </FormButton>
            <FormButton
                linkTo={buildUtorgPayLink(accountId, amount)}
                color='black'
                onClick={() => Mixpanel.track('CA Click Fund with Utorg')}
            >
                <Translate id='account.createImplicit.pre.utorg.buyWith'/>
                <img src={UtorgLogo} alt='utorg'/>
            </FormButton>
        </Container>
    );
};

export default FundWithUtorg;
