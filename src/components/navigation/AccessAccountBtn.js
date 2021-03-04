import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import ImportIcon from '../svg/ImportIcon';
import FormButton from '../common/FormButton';

const Button = styled(FormButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    svg {
        margin: -5px 6px -4px 0 !important;
        height: 22px !important;
        width: 22px !important;
    }
`

const AccessAccountBtn = () => (
    <Button linkTo='/recover-account' trackingId='IE Click add account button'>
        <ImportIcon/>
        <Translate id='button.importAccount'/>
    </Button>
)

export default AccessAccountBtn;