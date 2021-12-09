import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import YourAddress from './YourAddress';

const StyledContainer = styled(Container)`
    text-align: center;

    .address-title {
        text-align: left;
        margin: 40px 0 5px 0;
    }

    h3 {
        &.bottom {
            margin: 70px 0 10px 0;
        }
    }
`;

const StyledBuyButton = styled(FormButton)`
    &&&& {
        border-radius: 16px;
        flex: 1;
        margin-right: 8px;

        :last-child {
            margin-right: 0;
        }
    }
`;

const BuyButton = ({ amount }) => {
    return (
        <StyledBuyButton color='light-blue'>
            {amount ? (
                `$${amount}`
            ) : (
                <Translate id='account.createImplicitAccount.customAmount' />
            )
            }
        </StyledBuyButton>
    );
};

export default () => {
    return (
        <StyledContainer className='border small-centered'>
            <h3><Translate id='account.createImplicitAccount.title' /></h3>
            <div className='flex-center-center'>
                <BuyButton amount='10' />
                <BuyButton amount='50' />
                <BuyButton amount='100' />
                <BuyButton />
            </div>
            <h3 className='bottom'><Translate id='account.createImplicitAccount.orSendNear' data={{ amount: '0.1' }} /></h3>
            <Translate id='account.createImplicitAccount.sendFrom' />&nbsp;
            <FormButton className='link underline'><Translate id='account.createImplicitAccount.exchange' /></FormButton>,<br />
            <Translate id='account.createImplicitAccount.orAskFriend' />
            <div className='address-title'><Translate id='receivePage.addressTitle' /></div>
            <YourAddress address='herhehrthrdthrthrdhtrthrthrterergergergerhtrhehr' />
        </StyledContainer>
    );
};