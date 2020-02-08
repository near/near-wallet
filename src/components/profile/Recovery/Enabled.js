import React from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';

const EnabledContainer = styled.div`
    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            font-weight: 600;
            color: #24272a;
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
        white-space: normal;
        line-height: 150%;

        span {
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

const LinkString = (props) => {
    switch (props.data.method) {
        case 'email':
            return 'Resend Email'
        case 'phone':
            return 'Resend SMS'
        default:
            return ''
    }
}

const Enabled = (props) => {

    if (!props.disable) {
        return (
            <EnabledContainer>
                <div className='top'>
                    <div>
                        <div className='title'>{props.title}</div>
                        <div>{props.data.info}</div>
                    </div>
                    <Button onClick={props.onToggleDisable} title='Disable'>Disable</Button>
                </div>
                <div className='bottom'>
                    {`Enabled ${props.data.timeStamp}`}
                    <LinkButton onClick={props.onResend}>
                        <LinkString {...props}/>
                    </LinkButton>
                </div>
            </EnabledContainer>
        );
    } else {
        return (
            <DisableContainer>
                <div className='top'>
                    Are you sure you want to disable?<br/>
                    <span>
                        {`${props.data.method !== 'phrase' ? 'The magic link you received' : 'Your current seed phrase'} will be permanently disabled.`}
                    </span>
                </div>
                <div className='bottom'>
                    <Button>Disable {props.data.method}</Button>
                    <Button onClick={props.onToggleDisable}>No, Keep {props.data.method}</Button>
                </div>
            </DisableContainer>
        );
    }
}

export default Enabled;