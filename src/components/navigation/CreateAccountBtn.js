import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import FormButton from '../common/FormButton';
import PlusSignIcon from '../svg/PlusSignIcon';

const Button = styled(FormButton)`
    background-color: #72727A !important;
    border-color: #72727A !important;
    padding: 0;

    svg {
        width: 24px !important;
        height: 24px !important;
        margin: -4px 3px -6px 0 !important;
    }
`

const CreateAccountBtn = () => (
    <Button linkTo='/create' trackingId='CA Click create new account button' color='gray'>
        <PlusSignIcon/>
        <Translate id='button.createNewAccount'/>
    </Button>
)

export default CreateAccountBtn;