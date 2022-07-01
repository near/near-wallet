import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { getNearAndFiatValue } from '../../common/balance/helpers';
import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import GiftIcon from '../../svg/GiftIcon';

const Container = styled.div`
    background-color: #C8F6E0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;
    margin: 0 0 50px 0px;

    div {
        margin: 0 10px 0 20px;
        color: #005A46;
        flex: 1;
    }

    button {
        border-radius: 6px !important;
        padding: 8px 14px !important;
        height: auto !important;
        width: auto !important;
        font-size: 14px !important;
        margin: 0 0 0 auto !important;
    }

    @media (max-width: 450px) {
        margin: -35px -14px 50px -14px;
        border-radius: 0;

        button {
            width: 100% !important;
            margin-top: 25px !important;
        }
    }
`;

const LockupAvailTransfer = ({ onTransfer, available, sending, tokenFiatValue }) => {
    return (
        <Container className='lockup-avail-transfer'> 
            <GiftIcon/>
            <div>
                <SafeTranslate
                    id='profile.lockupBanner.title'
                    data={{ amount: getNearAndFiatValue(available, tokenFiatValue) }}
                />
            </div>
            <FormButton color='green-dark border'
                disabled={sending}
                sending={sending}
                sendingString='button.transferring'
                onClick={onTransfer}
                data-test-id="lockupTransferToWalletButton"
            >
                <Translate id='profile.lockupBanner.cta'/>
            </FormButton>
        </Container>
    );
};

export default LockupAvailTransfer;
