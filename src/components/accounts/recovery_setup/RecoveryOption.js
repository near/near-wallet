import React from 'react';
import styled from 'styled-components';
import EmailIcon from '../../svg/EmailIcon';
import PhoneIcon from '../../svg/PhoneIcon';
import PhraseIcon from '../../svg/PhraseIcon';

const Container = styled.div`
    background-color: #F8F8F8;
    border: 2px solid #E6E6E6;
    border-radius: 4px;
    padding: 15px;
    max-width: 500px;
    cursor: pointer;
    position: relative;
    margin-left: 35px;

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

        .icon {
            stroke: #0072CE !important;
        }
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
        margin-top: -3px;
    }

`

const Title = styled.div`
    font-size: 16px;
    color: #24272a;
    font-weight: 500;
    font-family: BwSeidoRound;
`

const SubTitle = styled.div`
    margin-top: 10px;
`

const Icon = (props) => {
    switch (props.option) {
        case 'email':
            return <EmailIcon/>
        case 'phone':
            return <PhoneIcon/>
        case 'phrase':
            return <PhraseIcon/>
        default:
            return
    }
}

const RecoveryOption = ({
    children,
    title,
    desc,
    option,
    onClick,
    active
}) => {
    return (
        <Container onClick={onClick} className={active ? 'active' : ''}>
            <Header>
                <Icon option={option}/>
                <Title>{title}</Title>
                <SubTitle>{desc}</SubTitle>
            </Header>
            {active ? children : ''}
        </Container>
    )
}

export default RecoveryOption;