import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { COLORS } from '../../utils/theme';
import FormButton from '../common/FormButton';
import ImportIcon from '../svg/ImportIcon';

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
`;

const AccessAccountBtn = () => (
    <Button
        linkTo='/recover-account'
        trackingId='IE Click add account button'
        id='IE Click add account button'
        color='dark-green'
    >
        <Translate id='button.importAccount' />
        <ImportIcon color={COLORS.green} />
    </Button>
);

export default AccessAccountBtn;
