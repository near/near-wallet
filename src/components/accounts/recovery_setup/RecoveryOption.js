import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EmailIcon from '../../svg/EmailIcon';
import PhoneIcon from '../../svg/PhoneIcon';
import PhraseIcon from '../../svg/PhraseIcon';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';
import { Translate } from 'react-localize-redux';
import IntFlagIcon from '../../../images/int-flag-small.svg';
import classNames from '../../../utils/classNames';

const Container = styled.div`
    background-color: #F8F8F8;
    border: 2px solid #E6E6E6;
    border-radius: 4px;
    padding: 15px;
    max-width: 500px;
    cursor: pointer;
    position: relative;
    margin-left: 35px;
    margin-top: 20px;

    :before {
        content: '';
        height: 22px;
        width: 22px;
        border: 2px solid #E6E6E6;
        position: absolute;
        left: -35px;
        top: 13px;
        border-radius: 50%;
    }

    path {
        stroke: #8dd4bd;
    }

    &.active {
        border-color: #0072CE;
        background-color: white;
        cursor: default;

        :before {
            background-color: #0072CE;
            border-color: #0072CE;
        }

        :after {
            content: '';
            position: absolute;
            transform: rotate(45deg);
            left: -27px;
            top: 17px;
            height: 11px;
            width: 6px;
            border-bottom: 2px solid white;
            border-right: 2px solid white;
        }

        .icon, path {
            stroke: #0072CE !important;
        }
    }
    &.inputProblem {
        border-color: #ff585d;
    }

    input {
        margin-top: 20px !important;
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
`

const Header = styled.div`
    position: relative;
    padding-left: 35px;

    svg {
        width: 23px;
        height: 23px;
        position: absolute;
        left: 0;
    }

`

const Title = styled.div`
    font-size: 16px;
    color: #24272a;
    font-weight: 500;

    span {
        color: #FF585D;
    }
`

const Icon = ({option}) => {
    switch (option) {
        case 'email':
            return <EmailIcon/>
        case 'phone':
            return <PhoneIcon/>
        case 'phrase':
            return <PhraseIcon/>
        case 'ledger':
            return <HardwareDeviceIcon/>
        default:
            return
    }
}

const RecoveryOption = ({
    children,
    option,
    onClick,
    active,
    disabled,
    problem
}) => {

    active = active === option;

    return (
        <Container 
            onClick={!disabled ? onClick : undefined} 
            className={classNames([{active: active && !disabled, disabled, inputProblem: problem}])}
        >
            <Header>
                <Icon option={option}/>
                <Title>
                    <Translate id={`setupRecovery.${option}Title`}/>
                    {active && option !== 'phrase' && option !== 'ledger' && <span>*</span>}
                </Title>
            </Header>
            {!disabled && active && children}
        </Container>
    )
}

RecoveryOption.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    option: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.string.isRequired,
    problem: PropTypes.bool
}

export default RecoveryOption;
