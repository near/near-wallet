import React from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';

const EnabledContainer = styled.div`

`

const DisableContainer = styled.div`

`

const Enabled = (props) => {
    if (!props.disable) {
        return (
            <EnabledContainer>
                {props.method}
                <Button onClick={props.onToggleDisable}>Disable</Button>
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