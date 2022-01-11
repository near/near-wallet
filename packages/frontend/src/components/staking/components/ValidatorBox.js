import React from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Mixpanel } from '../../../mixpanel/index';
import { redirectTo } from '../../../redux/actions/account';
import { PROJECT_VALIDATOR_VERSION, ValidatorVersion } from '../../../utils/constants';
import Balance from '../../common/balance/Balance';
import FormButton from '../../common/FormButton';
import Tooltip from '../../common/Tooltip';
import ChevronIcon from '../../svg/ChevronIcon';
import UserIcon from '../../svg/UserIcon';

const Container = styled.div`
    display: flex;
    align-items: center;
    background-color: #FAFAFA;
    border-radius: 8px;
    padding: 14px;
    position: relative;
    cursor: ${props => props.clickable === 'true' ? 'pointer' : ''};

    svg {
        height: 100%;

        &.user-icon {
            margin: -2px 10px 0 0;
            min-width: 36px;

            .background {
                fill: #F0F0F1;
            }
        }

        &.chevron-icon {
            margin: auto 5px auto 15px;
            min-width: 8px;
        }
    }

    .left, .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .left {
        div {
            text-align: left;
            color: #A7A29E;
            display: flex;
            flex-direction: row;
            &:first-of-type {
                color: #24272a;
                max-width: 165px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                @media (max-width: 350px) {
                    max-width: 130px;
                }

                @media (min-width: 500px) {
                    max-width: 230px;
                }
            }
        }
    }

    .right {
        margin-left: auto;
        text-align: right;

        > div {
            :first-of-type {
                color: #00C08B;
            }
        }

        .amount {
            color: #24272a;
            white-space: nowrap;
        }
    }

    .chevron-icon {
        display: none;
    }

    button {
        &.gray-blue {
            width: auto !important;
            margin: 0 !important;
            margin-left: auto !important;
            padding: 0px 10px !important;
            height: 34px !important;
        }
    }

    .with {
        position: absolute;
        top: -14px;
        padding: 5px 10px 2px 10px;
        background-color: white;
        border-radius: 40px;
        text-align: center;
        border: 2px solid #F2F2F2;
        left: 50%;
        transform: translateX(-50%);
    }

    .active {
        color: #00C08B;
    }

    .inactive {
        color: #FF585D;
    }

    .text-left {
        text-align: left;
    }
`;

export default function ValidatorBox({
    validator,
    amount,
    staking = true,
    clickable = true,
    style,
    label = false,
    stakeAction,
    showBalanceInUSD,
}) {
    const dispatch = useDispatch();
    const { accountId: validatorId, active } = validator;

    const fee = validator.fee && validator.fee.percentage;
    const cta = amount ? (
        <ChevronIcon />
    ) : (
        <FormButton
            className="gray-blue"
            linkTo={`/staking/${validatorId}`}
            data-test-id="stakingPageSelectValidator"
        >
            <Translate id="staking.validatorBox.cta" />
        </FormButton>
    );

    const handleClick = () => {
        Mixpanel.track("STAKE Go to staked account page");
        if (clickable && amount) {
            dispatch(redirectTo(`/staking/${validatorId}${stakeAction ? `/${stakeAction}` : ``}`));
        }
    };
    const isProjectValidator = validator.version === ValidatorVersion[PROJECT_VALIDATOR_VERSION];
    console.log(isProjectValidator, isProjectValidator && validator);
    return (
        <Container
            className='validator-box'
            data-test-id="stakingPageValidatorItem"
            clickable={clickable && amount ? 'true' : ''}
            style={style}
            onClick={handleClick}
        >
            {label && <div className='with'><Translate id='staking.validatorBox.with' /></div>}
            <UserIcon background={true} />
            <div className='left'>
                <div data-test-id="stakingPageValidatorItemName">
                    {validatorId}
                    {isProjectValidator && <Tooltip translate='staking.balanceBox.farm.info' />}
                </div>
                {typeof fee === 'number' &&
                    <div className="text-left">
                        {
                            isProjectValidator
                                ? <span>{fee}% <Translate id='staking.validatorBox.fee' /> - </span>
                                : <span>{fee}% <Translate id='staking.validatorBox.fee' /> - </span>
                        }
                        <span>
                            {
                                active ?
                                    <span className="active"> <Translate id='staking.validatorBox.state.active' /></span>
                                    :
                                    <span className="inactive"> <Translate id='staking.validatorBox.state.inactive' /></span>
                            }
                        </span>
                    </div>
                }
            </div>
            {amount &&
                <div className='right'>
                    {staking && <div><Translate id='staking.validatorBox.staking' /></div>}
                    <div className='amount'>
                        <Balance amount={amount} showBalanceInUSD={showBalanceInUSD} />
                    </div>
                </div>
            }
            {clickable ? cta : null}
        </Container>
    );
}
