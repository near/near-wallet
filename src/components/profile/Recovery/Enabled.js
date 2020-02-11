import React from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';
import { Translate } from 'react-localize-redux';

const EnabledContainer = styled.div`
    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            font-weight: 600;
            color: #24272a;
        }

        .info {
            text-overflow: ellipsis;
            max-width: 140px;
            white-space: nowrap;
            overflow: hidden;

            @media (min-width: 375px) {
                max-width: 160px;
            }

            @media (min-width: 998px) {
                max-width: 200px;
            }
        }

        button {
            color: #FF585D;
            background-color: rgba(255, 88, 93, 0.1);
            border: none;

            &:hover {
                color: white;
                background-color: #FF585D;
            }
        }
    }

    .bottom {
        display: flex;
        margin-top: 20px;
    }
`

const LinkButton = styled.div`
    color: #0072CE;
    margin-left: 10px;
    display: flex;
    cursor: pointer;

    &:before {
        content: '';
        width: 1px;
        height: 100%;
        display: inline-block;
        background-color: #e6e6e6;
        margin-right: 10px;
    }
`

const DisableContainer = styled.div`
    border: 2px solid #FF585D !important;
    border-radius: 6px;
    margin: -2px;

    .top {
        color: #24272a;
        font-weight: 600;
        line-height: 150%;

        div {
            font-weight: 400;
        }
    }

    .bottom {
        display: flex;
        align-items: center;
        margin-top: 10px;

        button {
            width: auto;

            &:first-of-type {
                background-color: #FF585D;
                border: none;
                padding: 5px 15px;
            }

            &:last-of-type {
                background-color: transparent;
                color: #999;
                text-transform: capitalize;
                text-decoration: underline;
                border: none;
                margin-left: 15px;
            }
        }
    }
`

const Enabled = (props) => {

    if (!props.disable) {
        return (
            <EnabledContainer>
                <div className='top'>
                    <div>
                        <div className='title'>{props.title}</div>
                        <div className='info'>{props.data.info}</div>
                    </div>
                    <Button onClick={props.onToggleDisable} title='Disable'>
                        <Translate id='button.disable'/>
                    </Button>
                </div>
                <div className='bottom'>
                    <Translate id='recoveryMgmt.enabled'/> {props.data.timeStamp}
                    {props.data.method !== 'phrase' &&
                        <LinkButton onClick={props.onResend}>
                            <Translate id={`recoveryMgmt.resend.${props.data.method}`}/>
                        </LinkButton>
                    }
                </div>
            </EnabledContainer>
        );
    } else {
        return (
            <DisableContainer>
                <div className='top'>
                    <Translate id='recoveryMgmt.disableTitle'/>
                    <div>
                        <Translate id={`recoveryMgmt.${props.data.method !== 'phrase' ? 'disableTextLink' : 'disableTextPhrase'}`}/>
                    </div>
                </div>
                <div className='bottom'>
                    <Button>
                        <Translate id='button.disable'/> {props.data.method}
                    </Button>
                    <Button onClick={props.onToggleDisable}>
                        <Translate id='recoveryMgmt.disableNo'/> {props.data.method}
                    </Button>
                </div>
            </DisableContainer>
        );
    }
}

export default Enabled;