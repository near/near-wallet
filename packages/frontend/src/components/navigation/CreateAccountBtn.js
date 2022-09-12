import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { COLORS } from '../../utils/theme';
import FormButton from '../common/FormButton';
import PlusSignIcon from '../svg/PlusSignIcon';

const Button = styled(FormButton)`
    padding: 0;
    margin-top: 15px !important;

    svg {
        width: 24px !important;
        height: 24px !important;
        margin: -4px 3px -6px 0 !important;
    }
`;

const CreateAccountBtn = () => (
    <Button linkTo='/create' trackingId='CA Click create new account button' color='dark-green'>
        <Translate id='button.createNewAccount'/>
        <PlusSignIcon color={COLORS.green}/>
    </Button>
);

export default CreateAccountBtn;
