import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import IconsAlertCircleImage from '../../images/icon_alert-circle.svg'
import IconCheckCircleImage from '../../images/icon-check-circle.svg'

import { clearAlert } from '../../actions/account'

import styled from 'styled-components'

const Alert = styled.div`
    position: fixed;
    background-color: #fff;
    border-left: 4px solid;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    z-index: 2100;
    right: 16px;
    border-color: ${props => props.success ? '#02ba86' : '#e41d22'};

    @media (max-width: 991px) {
        width: 100%;
        left: 0px;
        margin-top: -15px;
    }

    animation: ${props => props.closing
        ? `alertAnimationClose ease-in-out .3s forwards;`
        : `alertAnimation ease-in-out .3s;`
    }
    animation-iteration-count: 1;
    transform-origin: 50% 50%;

    @keyframes alertAnimation {
        0% {
            opacity: 0;
            transform: translate(16px,0px);
        }
        100% {
            opacity: 1;
            transform:  translate(0px,0px);
        }
    }
    @keyframes alertAnimationClose {
        0% {
            opacity: 1;
            transform: translate(0px,0px);
        }
        100% {
            opacity: 0;
            transform: translate(16px,0px);
        }
    }
`

const Content = styled.div`
    min-height: 60px;
    max-width: 500px;
    min-width: 275px;
    border: 2px solid #f2f2f2;
    border-radius: 0 3px 3px 0;
    display: flex;
    padding: 16px;

    @media (max-width: 991px) {
        width: 100%;
        max-width: 100%;
    }
`

const Icon = styled.div`
    padding-right: 16px;
    flex: 0 0 24px;

    img {
        width: 24px;
    }
`

const Text = styled.div`
    padding-right: 16px;
    color: #24272a;
    flex: 1 1 auto;
    padding-top: 4px;
`
const Close = styled.div`
    width: 12px;
    height: 12px;
    cursor: pointer;
    transition: .2s ease-in-out;
    position: relative;
    flex: 0 0 12px;

    &::before, &::after {
        content: '';
        top: 6px;
        width: 12px;
        height: 1px;
        background: #2083d4;
        position: absolute;
        transition: .1s ease-in-out;
    }
    &::before {
        transform: rotate(45deg);
    }
    &::after {
        transform: rotate(-45deg);
    }
    &:hover {
        &::before {
            transform: rotate(135deg);
        }
        &::after {
            transform: rotate(45deg);
        }
    }
`
const Header = styled.div`
    font-weight: 600;
    margin-bottom: 8px;
    color: ${props => props.success ? '#02ba86' : '#e41d22'};
`

const Console = styled.div`
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #656565;
    margin-top: 14px;
    background: #f2f2f2;
    padding: 8px;
`

const GlobalAlert = ({ globalAlert, clearAlert, closeIcon = true }) => {

    const [closing, setClosing] = useState(false)

    const onMissingTranslation = () => {
        if (!globalAlert.success) {
            return 'Sorry an error has occurred. You may want to try again.';
        }
    };

    const handleClose = () => {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            clearAlert()
        }, 300);
    }

    if (globalAlert && !(globalAlert.data && globalAlert.data.onlyError && globalAlert.success)) {
        return (
            <Alert success={globalAlert.success} closing={closing}>
                <Content>
                    <Icon>
                        <img src={globalAlert.success ? IconCheckCircleImage : IconsAlertCircleImage} alt={globalAlert.success ? 'Success' : 'Error'} />
                    </Icon>
                    <Text>
                        <Header success={globalAlert.success}>
                            <Translate id={globalAlert.messageCodeHeader || (globalAlert.success ? 'success' : 'error')} />
                        </Header>
                        <Translate id={globalAlert.messageCode} data={globalAlert.data} options={{ onMissingTranslation }} />
                        {globalAlert.errorMessage && 
                            <Console>
                                {globalAlert.errorMessage}
                            </Console>
                        }
                    </Text>
                    {closeIcon &&
                        <Close onClick={handleClose} />
                    }
                </Content>
            </Alert>
        )
    } else {
        return null
    }
}

const mapDispatchToProps = {
    clearAlert
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalAlert)
