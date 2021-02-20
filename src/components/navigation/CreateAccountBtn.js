import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import FormButton from '../common/FormButton';
import PlusSignIcon from '../svg/PlusSignIcon';

const Button = styled(FormButton)`
    background-color: #F0F0F1 !important;
    border-color: #F0F0F1 !important;
    padding: 0;
    color: #0072CE !important;
    margin-top: 15px !important;

    svg {
        width: 24px !important;
        height: 24px !important;
        margin: -4px 3px -6px 0 !important;
    }
`

const CreateAccountBtn = () => (
    <Button linkTo='/create' trackingId='CA Click create new account button' color='gray'>
        <PlusSignIcon color='#0072CE'/>
        <Translate id='button.createNewAccount'/>
    </Button>
)

export default CreateAccountBtn;