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
                Sure u want to disable?
                <Button onClick={props.onToggleDisable}>Don't disable</Button>
            </DisableContainer>
        );
    }
}

export default Enabled;