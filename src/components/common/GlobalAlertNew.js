import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import IconsAlertCircleImage from '../../images/icon_alert-circle.svg'
import IconCheckCircleImage from '../../images/icon-check-circle.svg'

import { clearAlert } from '../../actions/status'

import styled from 'styled-components'


const AlertContainer = styled.div`
    position: fixed;
    right: 16px;
    z-index: 900;

    @media (max-width: 991px) {
        left: 0px;
        margin-top: -15px;
    }
`


const Alert = styled.div`
    background-color: #fff;
    border-left: 4px solid;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    border-color: ${props => props.success ? '#02ba86' : '#e41d22'};
    margin-bottom: 12px;

    @media (max-width: 991px) {
        width: 100%;
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

const GlobalAlertNew = ({ globalAlert, actionStatus, clearAlert, closeIcon = true }) => {

    const [closing, setClosing] = useState(false)

    const onMissingTranslation = () => {
        if (!globalAlert.success) {
            return 'Sorry an error has occurred. You may want to try again.';
        }
    };

    const handleClose = (type) => {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            clearAlert(type)
        }, 300);
    }

    const alerts = Object.keys(globalAlert)
        .filter((type) => globalAlert[type])
        .map((type) => ({
            type,
            ...globalAlert[type],
            ...actionStatus[type]
        }))
    

    if (!!alerts.length) {
        return (
            <AlertContainer>
                {alerts.map((alert, i) => alert.show && (
                    <Alert key={`alert-${i}`} success={alert.success} closing={closing} position={i}>
                        <Content>
                            <Icon>
                                <img src={alert.success ? IconCheckCircleImage : IconsAlertCircleImage} alt={alert.success ? 'Success' : 'Error'} />
                            </Icon>
                            <Text>
                                <Header success={alert.success}>
                                    <Translate id={alert.messageCodeHeader || (alert.success ? 'success' : 'error')} />
                                </Header>

                                <Translate id={alert.messageCode} data={alert.data} options={{ onMissingTranslation }} />

                                {alert.console && 
                                    <Console>
                                        {alert.errorMessage}
                                    </Console>
                                }
                            </Text>
                            {closeIcon &&
                                <Close onClick={() => handleClose(alert.type)} />
                            }
                        </Content>
                    </Alert>
                ))}
            </AlertContainer>
        )
    } else {
        return null
    }
}

const mapDispatchToProps = {
    clearAlert
}

const mapStateToProps = ({ status }) => ({
    ...status
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalAlertNew)
