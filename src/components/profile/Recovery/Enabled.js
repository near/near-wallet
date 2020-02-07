import React from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';

const EnabledContainer = styled.div`

`

const LinkButton = styled.div`
    color: #0072CE;
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
                <div>
                    {props.title}
                    {props.data.info}
                    <Button onClick={props.onToggleDisable}>Disable</Button>
                </div>
                <div>
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