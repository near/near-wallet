import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { Mixpanel } from '../../../mixpanel/index';
import Button from '../../common/Button';
import FormButton from '../../common/FormButton';

const EnabledContainer = styled.div`
    &&& {
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                font-weight: 500;
                color: #24272a;
            }

            .info {
                text-overflow: ellipsis;
                max-width: 140px;
                white-space: nowrap;
                overflow: hidden;
                color: #A1A1A9;

                @media (min-width: 375px) {
                    max-width: 180px;
                }

                @media (min-width: 998px) {
                    max-width: 200px;
                }
            }

            button {
                color: #FF585D;
                background-color: #f8f8f8;
                border: none;
                font-weight: 600;

                &:hover {
                    color: white;
                    background-color: #FF585D;
                }
            }
        }

        .bottom {
            display: flex;
            margin-top: 20px;
            color: #A1A1A9;

            button {
                text-decoration: none;
                margin-left: 10px;
                text-transform: capitalize !important;

                :before {
                    content: '';
                    width: 1px;
                    height: 12px;
                    display: inline-block;
                    background-color: #e6e6e6;
                    margin-right: 10px;
                }
            }
        }
    }
`;

const DisableContainer = styled.form`
    && {
        border: 2px solid #FF585D !important;
        border-radius: 8px;
        margin: -2px;
        padding: 15px 20px;

        .top {
            color: #24272a;
            font-weight: 600;

            div {
                font-weight: 400;
            }
        }

        .bottom {
            display: flex;
            align-items: center;
            margin-top: 10px;

            button {
                margin-top: 0;

                &:first-of-type {
                    padding: 5px 15px;
                    width: 155px;
                }

                &:last-of-type {
                    color: #999;
                    margin-left: 15px;
                    padding: 5px;
                }
            }
        }

        .not-allowed {
            color: #24272a;
            button {
                display: block;
                margin-top: 15px;
            }
        }
    }
`;

const UnsupportedMethod = styled.p`
    font-weight: 600;
    color: #ff585d;
`;

class ActiveMethod extends Component {

    state = {
        disable: false,
        username: ''
    };

    handleToggleDisable = () => {
        this.setState((prevState) => ({
            disable: !prevState.disable
        }));
    }

    render() {

        const { disable, username } = this.state;
        const { data, onDelete, accountId, deletingMethod, deleteAllowed, mainLoader } = this.props;

        if (!disable) {
            return (
                <EnabledContainer>
                    <div className='top'>
                        <div>
                            <div className='title'>
                                <Translate id={`recoveryMgmt.methodTitle.${data.kind}`}/>
                            </div>
                            <div className='info'>{data.detail}</div>
                        </div>
                        <Button
                            onClick={() => {
                                Mixpanel.track(data.kind === 'phrase' ? 'SR-SP Click disable button': `SR Click disable button for ${data.kind}`);
                                this.handleToggleDisable();
                            }}
                            title='Disable'
                        >
                            <Translate id='button.disable'/>
                        </Button>
                    </div>
                    <div className='bottom'>
                        <Translate id='recoveryMgmt.enabled'/> {new Date(data.createdAt).toDateString().replace(/^\S+\s/,'')}
                    </div>
                </EnabledContainer>
            );
        } else {
            return (
                <DisableContainer onSubmit={(e) => {
                    onDelete();
                    e.preventDefault();
                }}>
                    {!deleteAllowed && (
                        <div className='not-allowed'>
                            <Translate id='recoveryMgmt.disableNotAllowed'/>
                            <FormButton
                                onClick={this.handleToggleDisable}
                                trackingId={data.kind === 'phrase'? 'SR-SP Click close button': `SR Click close button for ${data.kind}`}
                                type='button'
                                className='small gray-blue'
                            >
                                <Translate id='button.close'/>
                            </FormButton>
                        </div>
                    )}
                    {deleteAllowed && (
                        <>
                            <div className='top'>
                                <Translate id='recoveryMgmt.disableTitle'/>
                                <div>
                                    <Translate id={`recoveryMgmt.${data.kind !== 'phrase' ? 'disableTextLink' : 'disableTextPhrase'}`}/>
                                </div>
                                {
                                    data.kind === 'email' && (
                                        <UnsupportedMethod>
                                            <Translate id='recoveryMgmt.unsupportedMethodEmail' />
                                        </UnsupportedMethod>
                                    )
                                }
                                {
                                    data.kind === 'phone' && (
                                        <UnsupportedMethod>
                                            <Translate id='recoveryMgmt.unsupportedMethodPhone' />
                                        </UnsupportedMethod>
                                    )
                                }
                            </div>
                            <Translate>
                                {({ translate }) => (
                                    <input
                                        placeholder={translate('recoveryMgmt.disableInputPlaceholder')}
                                        value={username}
                                        onChange={(e) => this.setState({ username: e.target.value })}
                                        autoComplete='off'
                                        spellCheck='false'
                                        disabled={deletingMethod}
                                    />
                                )}
                            </Translate>
                            <div className='bottom'>
                                <FormButton
                                    type='submit'
                                    color='red small'
                                    disabled={deletingMethod || username !== accountId || mainLoader}
                                    sending={deletingMethod}
                                    sendingString='button.disabling'
                                >
                                    <Translate id='button.disable'/> {data.kind}
                                </FormButton>
                                <FormButton
                                    type='button'
                                    color='link'
                                    onClick={this.handleToggleDisable}
                                    trackingId={data.kind === 'phrase'? 'SR-SP Click close link': `SR Click close link for ${data.kind}`}
                                >
                                    <Translate id='recoveryMgmt.disableNo'/> {data.kind}
                                </FormButton>
                            </div>
                        </>
                    )}
                </DisableContainer>
            );
        }
    }
}

export default ActiveMethod;
