import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import SafeTranslate from '../../../SafeTranslate';
import MoonPayIcon from '../../../svg/MoonPayIcon';
import AccountNeedsFunding from '../status/AccountNeedsFunding';

const StyledContainer = styled(Container)`
    &&& {
        h2 {
            margin-bottom: 40px;
        }
    
        > button {
            &.black {
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
            }

            &.link {
                margin: 30px auto 0 auto;
                display: block;
            }
        }
    }
`;

export default ({
    fundingAddress,
    minDeposit,
    formattedMinDeposit,
    moonpaySignedUrl,
    onClickCancel
}) => {
    return (
        <>
            <StyledContainer className='small-centered border'>
                <h1><Translate id='initialDeposit.creditCard.title' /></h1>
                <h2><SafeTranslate id='initialDeposit.creditCard.desc' data={{ amount: formattedMinDeposit }}/></h2>
                <AccountNeedsFunding
                    fundingAddress={fundingAddress}
                    minDeposit={minDeposit}
                />
                <FormButton
                    linkTo={moonpaySignedUrl}
                    color='black'
                >
                    <Translate id='button.fundWith' />
                    <MoonPayIcon />
                </FormButton>
                <FormButton
                    onClick={onClickCancel}
                    className='link'
                    color='gray'
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </StyledContainer>
        </>
    );
};
