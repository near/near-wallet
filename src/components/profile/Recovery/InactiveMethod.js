import React from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';
import { Translate } from 'react-localize-redux';

const NotEnabledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: #24272a;
`

const InactiveMethod = ({
    kind,
    onEnable
}) => (
    <NotEnabledContainer>
        <Translate id={`recoveryMgmt.methodTitle.${kind}`}/>
        <Button onClick={onEnable}>
            <Translate id='button.enable'/>
        </Button>
    </NotEnabledContainer>
)

export default InactiveMethod;