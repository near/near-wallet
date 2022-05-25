import React, {ReactNode} from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
//@ts-ignore
import IntFlagIcon from '../../../images/int-flag-small.svg';
import classNames from '../../../utils/classNames';
import EmailIcon from '../../svg/EmailIcon';

const Container = styled.div`
    background-color: #F8F8F8;
    border: 2px solid #E6E6E6;
    border-radius: 4px;
    padding: 15px;
    max-width: 500px;
    cursor: pointer;
    position: relative;
    margin-top: 20px;

    path {
        stroke: #8dd4bd;
    }

    .color-red {
        margin-top: 15px;
    }

    &.active {
        border-color: #0072CE;
        background-color: white;
        cursor: default;

        :before {
            background-color: #0072CE;
            border-color: #0072CE;
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

        // TODO: Move phone input style to common

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
`;

const Header = styled.div`
    position: relative;
    padding-left: 35px;

    svg {
        width: 23px;
        height: 23px;
        position: absolute;
        left: 0;
    }

`;

const Title = styled.div`
    font-size: 16px;
    color: #24272a;
    font-weight: 500;
`;

type TwoFactorOptionProps = {
    children: ReactNode | ReactNode[]
    option: string;
    onClick: ()=> void;
    active: string | boolean;
    problem?: string;
}

const TwoFactorOption = ({
    children,
    option,
    onClick,
    active,
    problem
}:TwoFactorOptionProps) => {

    active = active === option;

    return (
        <Container onClick={onClick} className={classNames([{active: active, inputProblem: problem}])}>
            <Header>
                {option === 'email' ? <EmailIcon/> : null}
                <Title><Translate id={`twoFactor.${option}`}/></Title>
            </Header>
            {active && children}
        </Container>
    );
};

export default TwoFactorOption;
