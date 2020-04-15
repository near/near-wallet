import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import Button from '../../common/Button';
import FormButton from '../../common/FormButton';

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
            background-color: #f8f8f8;
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
    && {
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
                width: auto !important;
                margin-top: 0;

                &:first-of-type {
                    background-color: #FF585D;
                    border: none;
                    padding: 5px 15px;
                    text-transform: uppercase;
                    width: 151px !important;
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
    }
`

class ActiveMethod extends Component {

    state = {
        disable: false
    };

    handleToggleDisable = () => {
        this.setState(prevState => ({
            disable: !prevState.disable
        }));
    }

    render() {

        const { data, onResend, onDelete } = this.props;
        const deletingMethod = this.props.deletingMethod === data.kind;

        if (!this.state.disable) {
            return (
                <EnabledContainer>
                    <div className='top'>
                        <div>
                            <div className='title'>
                                <Translate id={`recoveryMgmt.methodTitle.${data.kind}`}/>
                            </div>
                            <div className='info'>{data.detail}</div>
                        </div>
                        <Button onClick={this.handleToggleDisable} title='Disable'>
                            <Translate id='button.disable'/>
                        </Button>
                    </div>
                    <div className='bottom'>
                        <Translate id='recoveryMgmt.enabled'/> {new Date(data.createdAt).toDateString().replace(/^\S+\s/,'')}
                        {data.kind !== 'phrase' &&
                            <LinkButton onClick={onResend}>
                                <Translate id={`recoveryMgmt.resend.${data.kind}`}/>
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
                            <Translate id={`recoveryMgmt.${data.kind !== 'phrase' ? 'disableTextLink' : 'disableTextPhrase'}`}/>
                        </div>
                    </div>
                    <div className='bottom'>
                        <FormButton
                            onClick={onDelete}
                            color='red small'
                            disabled={deletingMethod}
                            sending={deletingMethod}
                        >
                            <Translate id='button.disable'/> {data.kind}
                        </FormButton>
                        <Button onClick={this.handleToggleDisable}>
                            <Translate id='recoveryMgmt.disableNo'/> {data.kind}
                        </Button>
                    </div>
                </DisableContainer>
            );
        }
    }
}

export default ActiveMethod;