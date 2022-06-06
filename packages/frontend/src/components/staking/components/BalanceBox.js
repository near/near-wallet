import BN from 'bn.js';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled, { css } from 'styled-components';

import classNames from '../../../utils/classNames';
import Balance from '../../common/balance/Balance';
import FormButton from '../../common/FormButton';
import Tooltip from '../../common/Tooltip';
import TokenIcon from '../../send/components/TokenIcon';
import TokenAmount from '../../wallet/TokenAmount';

const Container = styled.div`
    ${(props) => !props.hideBorder && css`
        border-bottom: 2px solid #F2F2F2;
    `}
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

        .fiat-amount {
            font-size: 14px;
            font-weight: 400;
            margin-top: 6px;
            color: #72727A;
            line-height: normal;
        }
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

    .token-balance {
        display: flex;

        .icon {
            width: 32px;
            height: 32px;
            min-width: 32px;
            min-height: 32px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-radius: 50%;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
            align-self: center;

            img, svg {
                height: 32px;
                width: 32px;
            }
        }
    }
`;

export default function BalanceBox({
    title,
    token,
    info,
    onClick,
    button,
    buttonColor,
    loading,
    disclaimer,
    linkTo,
    buttonTestId,
    balanceTestId,
    hideBorder = false
}) {
    return (
        <Container className='balance-box' hideBorder={hideBorder}>
            <div className='left'>
                {
                    (title || info) &&
                    <div className='title'>
                        {title && <Translate id={title}/>}
                        {info && <Tooltip translate={info}/>}
                        {loading && <span className="animated-dots" />}
                    </div>
                }
                <div className='token-balance'>
                    <div className='icon'>
                        <TokenIcon symbol={token.onChainFTMetadata?.symbol} icon={token.onChainFTMetadata?.icon}/>
                    </div>
                    {token.onChainFTMetadata?.symbol === 'NEAR' &&
                    !token.contractName ? (
                        <Balance
                            amount={token.balance}
                            data-test-id={balanceTestId}
                            symbol={false}
                        />
                    ) : (
                        <TokenAmount
                            token={token}
                            className="balance"
                            withSymbol={true}
                            data-test-id={balanceTestId}
                        />
                    )}
                </div>

                {disclaimer &&
                <div className='withdrawal-disclaimer'>
                    <Translate id={disclaimer}/>
                </div>
                }
            </div>
            {button && (onClick || linkTo) &&
            <FormButton
                data-test-id={buttonTestId}
                disabled={new BN(token.balance).isZero() || loading}
                onClick={onClick}
                linkTo={linkTo}
                className={classNames(['small', buttonColor])}
            >
                <Translate id={button}/>
            </FormButton>
            }
        </Container>
    );
}
