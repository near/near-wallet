import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import UtorgLogo from '../../../../images/utorg-logo.png';
import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import WhereToBuyNearModal from '../../../common/WhereToBuyNearModal';
import MoonPayIcon from '../../../svg/MoonPayIcon';
import { buildUtorgPayLink } from '../FundWithUtorg';
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

    &&& {
        > button {
            &.black, &.gray-gray {
                width: 100%;
                background-color: #272729;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 45px;

                svg {
                    width: 105px;
                    height: auto;
                    margin: 0 0 0 10px;
                }
                
                img {
                    width: 105px;
                    height: auto;
                    margin: 0 0 0 10px;
                }
            }

            &.gray-gray {
                background-color: #cccccc;
            }
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

const BuyButton = ({
    amountUSD,
    onClickBuyButton
}) => {

    const getBuyButtonLabel = (amountUSD) => {
        if (amountUSD) {
            return `$${amountUSD}`;
        }
        return (<Translate id='account.createImplicitAccount.customAmount' />);
    };

    return (
        <StyledBuyButton
            color='light-blue'
            onClick={() => onClickBuyButton(amountUSD)}
        >
            {getBuyButtonLabel(amountUSD)}
        </StyledBuyButton>
    );
};

export default ({
    implicitAccountId,
    formattedMinDeposit,
    moonpayIsAvailable,
    moonpaySignedUrl
}) => {
    const [showWhereToBuyModal, setShowWhereToBuyModal] = useState(false);
    return (
        <>
            <StyledContainer className='border small-centered'>
                <h3><Translate id='account.createImplicitAccount.title' /></h3>
                {<div className='flex-center-center'>
                    {['30', '50', '100', ''].map((amount) => (
                        <BuyButton
                            key={`${amount}`}
                            amountUSD={amount}
                            onClickBuyButton={() => {
                                window.open(
                                    buildUtorgPayLink(implicitAccountId, undefined, amount, 'USD'),
                                    '_blank'
                                );
                            }}
                        />
                    ))}
                </div>}
                {/*
                TEMPORARILY DISABLE MOONPAY PRE-SPECIFIED AMOUNT BUTTONS,
                WHILE MOONPAY 'baseCurrencyAmount' IS BROKEN
                ISSUE: https://github.com/near/near-wallet/issues/2408

                ENABLED UTORG
                */}
                <FormButton
                    linkTo={buildUtorgPayLink(implicitAccountId)}
                    color='black'
                    sending={!implicitAccountId}
                    sendingString='button.loading'
                >
                    <Translate id='buyNear.buyWith' />
                    <img src={UtorgLogo} alt='utorg'/>
                </FormButton>
                <FormButton
                    disabled={!moonpayIsAvailable}
                    sending={!implicitAccountId || moonpaySignedUrl === null}
                    sendingString='button.loading'
                    color={moonpayIsAvailable ? 'black' : 'gray-gray'}
                    linkTo={moonpaySignedUrl}
                >
                    {moonpayIsAvailable
                        ? <>
                            <Translate id='buyNear.buyWith' />
                            <MoonPayIcon />
                        </> : <>
                            <MoonPayIcon color='#3F4045' />
                            <Translate id='buyNear.notSupported' />
                        </>
                    }
                </FormButton>
                <h3 className='bottom'><Translate id='account.createImplicitAccount.orSendNear' data={{ amount: formattedMinDeposit }} /></h3>
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
