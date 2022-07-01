import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import IconCheckCircleImage from '../../images/icon-check-circle.svg';
import IconsAlertCircleImage from '../../images/icon_alert-circle.svg';
import { clearGlobalAlert } from '../../redux/actions/status';
import { selectStatusSlice } from '../../redux/slices/status';
import SafeTranslate from '../SafeTranslate';

const AlertContainer = styled.div`
    position: fixed;
    right: 16px;
    z-index: 2100;

    animation: alertAnimation ease-in-out .3s;
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

    @media (max-width: 991px) {
        left: 0px;
        right: 0px;
        margin-top: -15px;
    }

    .message-code {
        display: flex;
        align-items: center;

        a {
            white-space: nowrap;
            background-color: #f2f2f2;
            border: 2px solid #f2f2f2;
            font-weight: 600;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 13px;
            margin-left: 10px;
            transition: 100ms;
            text-align: center;

            :hover {
                text-decoration: none;
                background-color: transparent;
            }
        }

        @media (max-width: 500px) {
            flex-direction: column;
            align-items: flex-start;

            a {
                margin: 10px 0 0 0;
            }
        }
    }
`;


const Alert = styled.div`
    background-color: #fff;
    border-left: 4px solid;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.04);
    border-color: ${(props) => props.success ? '#02ba86' : '#e41d22'};
    margin-bottom: 12px;

    @media (max-width: 991px) {
        width: 100%;
    }

    &.number-${(props) => props.closing} {
        animation: alertAnimationClose ease-in-out .3s forwards;
    }
    animation-iteration-count: 1;
    transform-origin: 50% 50%;

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
`;

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
`;

const Icon = styled.div`
    padding-right: 16px;
    flex: 0 0 24px;

    img {
        width: 24px;
    }
`;

const Text = styled.div`
    padding-right: 16px;
    color: #24272a;
    flex: 1 1 auto;
    padding-top: 4px;
`;
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
`;
const Header = styled.div`
    font-weight: 600;
    margin-bottom: 8px;
    color: ${(props) => props.success ? '#02ba86' : '#e41d22'};
`;

const Console = styled.div`
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #656565;
    margin-top: 14px;
    background: #f2f2f2;
    padding: 8px;
    word-break: break-word;
`;

const GlobalAlertNew = ({ globalAlert, actionStatus, clearGlobalAlert, closeIcon = true }) => {

    const [closing, setClosing] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const zendeskBaseURL = 'https://nearhelp.zendesk.com/hc/';

    const handleClose = (type) => {
        setClosing(type);
        setTimeout(() => {
            clearGlobalAlert(type);
            setClosing(false);
        }, 300);
    };

    useEffect(() => {
        setAlerts(Object.keys(globalAlert)
            .filter((type) => globalAlert[type])
            .reverse()
            .map((type) => ({
                type,
                ...globalAlert[type],
                ...actionStatus[type]
            }))
        );
    }, [globalAlert]);

    if (!!alerts.length) {
        return (
            <AlertContainer types={alerts.map((alert) => alert.type)}>
                <Translate>
                    {({ translate }) => (
                        <>
                            {alerts.filter((alert) => alert.show).map((alert, i) => {
                                const msgCode = typeof translate(alert.messageCode) === 'string' ? translate(alert.messageCode) : '';
                                const noTranslationFound = msgCode.includes('No default translation found!');
                                return (
                                    <Alert key={`alert-${i}`} success={alert.success} closing={closing} className={`number-${alert.type}`} type={alert.type}>
                                        <Content>
                                            <Icon>
                                                <img src={alert.success ? IconCheckCircleImage : IconsAlertCircleImage} alt=''/>
                                            </Icon>
                                            <Text>
                                                <Header success={alert.success}>
                                                    <Translate id={alert.messageCodeHeader || (alert.success ? 'success' : 'error')} />
                                                </Header>
                                                <div className='message-code'>
                                                    {noTranslationFound
                                                        ? <Translate id={`reduxActions.default.${alert.success ? 'success' : 'error'}`} />
                                                        : <SafeTranslate id={alert.messageCode} data={alert.data} />
                                                    }
                                                    {!alert.success && (
                                                        <a
                                                            href={(noTranslationFound || msgCode.includes('Sorry an error has occurred'))
                                                                ? `${zendeskBaseURL}${alert.errorMessage ? `search?query=${encodeURIComponent(alert.errorMessage.substring(0, 500))}` : ''}` 
                                                                : `${zendeskBaseURL}search?query=${encodeURIComponent(msgCode.substring(0, 500))}`
                                                            }
                                                            target='_blank'
                                                            rel='noreferrer'
                                                        >
                                                            <Translate id='button.viewFAQ'/>
                                                        </a>
                                                    )}
                                                </div>
                                                {alert.console && (
                                                    <Console>
                                                        {alert.errorMessage}
                                                    </Console>
                                                )}
                                            </Text>
                                            {closeIcon &&
                                                <Close onClick={() => handleClose(alert.type)} />
                                            }
                                        </Content>
                                    </Alert>
                                );
                            })}
                        </>
                    )}
                </Translate>
            </AlertContainer>
        );
    } else {
        return null;
    }
};

const mapDispatchToProps = {
    clearGlobalAlert
};

const mapStateToProps = (state) => ({
    ...selectStatusSlice(state)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalAlertNew);
