import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import WhereToBuyNearModal from '../../../common/WhereToBuyNearModal';
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

const BuyButton = ({ amountUSD, onClickBuyButton }) => (
    <StyledBuyButton
        color='light-blue'
        onClick={() => onClickBuyButton(amountUSD)}
    >
        {amountUSD ? (
            `$${amountUSD}`
        ) : (
            <Translate id='account.createImplicitAccount.customAmount' />
        )
        }
    </StyledBuyButton>
);

export default ({ onClickBuyButton, implicitAccountId }) => {
    const [showWhereToBuyModal, setShowWhereToBuyModal] = useState(false);
    return (
        <>
            <StyledContainer className='border small-centered'>
                <h3><Translate id='account.createImplicitAccount.title' /></h3>
                <div className='flex-center-center'>
                    <BuyButton amountUSD='30' onClickBuyButton={onClickBuyButton} />
                    <BuyButton amountUSD='50' onClickBuyButton={onClickBuyButton} />
                    <BuyButton amountUSD='100' onClickBuyButton={onClickBuyButton} />
                    <BuyButton onClickBuyButton={onClickBuyButton} />
                </div>
                <h3 className='bottom'><Translate id='account.createImplicitAccount.orSendNear' data={{ amount: '0.1' }} /></h3>
                <Translate id='account.createImplicitAccount.sendFrom' />&nbsp;
                <FormButton onClick={() => setShowWhereToBuyModal(true)} className='link underline'><Translate id='account.createImplicitAccount.exchange' /></FormButton>,<br />
                <Translate id='account.createImplicitAccount.orAskFriend' />
                <div className='address-title'><Translate id='receivePage.addressTitle' /></div>
                <YourAddress address={implicitAccountId} />
            </StyledContainer>
            {showWhereToBuyModal &&
                <WhereToBuyNearModal
                    onClose={() => setShowWhereToBuyModal(false)}
                    open={showWhereToBuyModal}
                />
            }
        </>
    );
};