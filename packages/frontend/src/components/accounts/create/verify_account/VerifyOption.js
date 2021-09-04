import PropTypes from 'prop-types';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IntFlagIcon from '../../../../images/int-flag-small.svg';
import classNames from '../../../../utils/classNames';
import CoinDepositIcon from '../../../svg/CoinDepositIcon';
import CreditCardIcon from '../../../svg/CreditCardIcon';
import EmailIconOne from '../../../svg/EmailIconOne';
import PhoneIconOne from '../../../svg/PhoneIconOne';

const Container = styled.div`
    background-color: #FAFAFA;
    border-radius: 8px;
    padding: 15px;
    max-width: 500px;
    cursor: pointer;
    position: relative;
    margin-top: 20px;
    border-left: 4px solid #FAFAFA;
    overflow: hidden;

    @media (max-width: 499px) {
        margin: 20px -14px 0 -14px;
        border-radius: 0;
    }

    .color-red {
        margin-top: 15px;
    }

    :before {
        content: '';
        height: 23px;
        width: 23px;
        top: 29px;
        border: 2px solid #E6E6E6;
        position: absolute;
        border-radius: 50%;
    }

    .title {
        color: #3F4045;
        font-weight: 600;
    }

    .desc { 
        color: #72727A;
        max-width: 270px;
        margin-top: 5px;

        @media (max-width: 450px) {
            max-width: 240px;
        }

        @media (max-width: 360px) {
            max-width: 175px;
        }
    }

    svg {
        &.hardware-wallet-icon {
            width: 66px;
            margin-right: -23px;
            position: absolute;
            right: 0;
            top: -6px;
        }
    }

    &.active {
        background-color: #F0F9FF;
        cursor: default;
        border-left: 4px solid #2B9AF4;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

        :before {
            background-color: #2B9AF4;
            border-color: #2B9AF4;
        }

        :after {
            content: '';
            position: absolute;
            transform: rotate(45deg);
            left: 21px;
            top: 35px;
            height: 11px;
            width: 11px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 1px 0px 2px 0px #0000005;
        }

        .title {
            color: #003560;
        }

        .desc {
            color: #005497;
        }

        > hr {
            border: 0;
            background-color: #D6EDFF;
            height: 1px;
            margin: 20px -15px 0px -15px;
        }
    }
    &.error {
        border-color: #ff585d;
    }

    input {
        margin-top: 20px;
    }

    .react-phone-number-input {
        position: relative;

        .react-phone-number-input__country {
            position: absolute;
            right: 0;
            z-index: 1;
            top: 50%;
            transform: translateY(calc(-50% + 10px));
        }

        .react-phone-number-input__icon { 
            &:not(.react-phone-number-input__icon--international) {
                margin-right: 5px;
            }
        }

        .react-phone-number-input__icon--international {
            svg {
                display: none;
            }
            
            background-image: url(${IntFlagIcon});
            background-repeat: no-repeat;
        }

        .react-phone-number-input__icon {
            border: 0;
        }

        .react-phone-number-input__country-select-arrow {
            width: 8px;
            height: 8px;
            border-color: black;
            border-width: 0 1px 1px 0;
            transform: rotate(45deg);
            margin-top: -1px;
            margin-left: 5px;
            margin-right: 5px;
        }

        select {
            font-size: 16px;
        }
    }

    &.disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

const Header = styled.div`
    position: relative;
    padding-left: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
        width: 50px;

    }
`;

const Icon = ({ option, color }) => {
    switch (option) {
        case 'email':
            return <EmailIconOne color={color} />;
        case 'phone':
            return <PhoneIconOne color={color} />;
        case 'creditCard':
            return <CreditCardIcon color={color} />;
        case 'manualDeposit':
            return <CoinDepositIcon color={color} />;
        default:
            return;
    }
};

const VerifyOption = ({
    children,
    option,
    onClick,
    active,
    disabled,
    error,
    translateIdTitle,
    translateIdDesc
}) => {

    active = active === option;

    return (
        <Container
            onClick={!disabled && onClick}
            className={classNames([{ active: active && !disabled, disabled, error: error }])}
        >
            <Header>
                <div>
                    <div className='title'>
                        <Translate id={translateIdTitle} />
                    </div>
                    <div className='desc'>
                        <Translate id={translateIdDesc} />
                    </div>
                </div>
                <Icon option={option} color={active} />
            </Header>
            {active && children && <hr />}
            {!disabled && active && children}
        </Container>
    );
};

VerifyOption.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    option: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.string.isRequired,
    problem: PropTypes.bool
};

export default VerifyOption;
