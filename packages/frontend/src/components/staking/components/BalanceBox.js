import BN from 'bn.js';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import classNames from '../../../utils/classNames';
import Balance from '../../common/balance/Balance';
import FormButton from '../../common/FormButton';
import Tooltip from '../../common/Tooltip';

const Container = styled.div`
    border-bottom: 2px solid #F2F2F2;
    padding: 15px 0;
    display: flex;

    @media (max-width: 767px) {
        padding: 15px 14px;
    }

    .balance {
        display: block;
        margin-top: 10px !important;
        color: #24272a;
        font-size: 16px;
        font-weight: 700;
    }

    .title {
        color: #6E7073;
        display: flex;
        align-items: center;
        
        .tooltip {
            margin-bottom: -1px;
        }
    }

    .trigger {

        margin-left: 10px;

        svg {
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
        }
    }

    button {
        &.small {
            width: auto !important;
            padding: 0px 15px !important;
            margin: auto 0 auto auto !important;
        }
    }

    .left {
        width: 100%;
    }

    @media (max-width: 767px) {
        border: 0;
        border-bottom: 2px solid #F2F2F2;
        margin: 0px -14px 0 -14px;
        border-radius: 0;
    }
`;

export default function BalanceBox({
    title,
    amount,
    info,
    onClick,
    button,
    buttonColor,
    loading,
    disclaimer,
    linkTo,
    buttonTestId,
    balanceTestId,
    isNear = true,
    tokenMeta: {tokenPrice, tokenId, tokenName, isWhiteListed, farmTitle} = {}
}) {

    return (
        <Container className='balance-box'>
            <div className='left'>
                <div className='title'>
                    {farmTitle || <Translate id={title} />}
                    <Tooltip translate={info}/>
                </div>
                <Balance 
                    data-test-id={balanceTestId}
                    amount={amount}
                    isNear={isNear}
                    tokenMeta={{tokenPrice, tokenId, tokenName, isWhiteListed}}/>
                {disclaimer &&
                    <div className='withdrawal-disclaimer'>
                        <Translate id={disclaimer} />
                    </div>
                }
            </div>
            {button && (onClick || linkTo) &&
                <FormButton
                    data-test-id={buttonTestId}
                    disabled={new BN(amount).isZero() || loading}
                    onClick={onClick}
                    linkTo={linkTo}
                    className={classNames(['small', buttonColor])}
                >
                    <Translate id={button} />
                </FormButton>
            }
        </Container>
    );
}