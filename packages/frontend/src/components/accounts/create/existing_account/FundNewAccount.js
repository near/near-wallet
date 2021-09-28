import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButtonGroup from '../../../common/FormButtonGroup';
import Container from '../../../common/styled/Container.css';
import EstimatedFees from '../../../transfer/EstimatedFees';
import TransferAmount from '../../../transfer/TransferAmount';

const StyledContainer = styled(Container)`
    text-align: center;
    > div {
        color: #A2A2A8;
    }
    h3 {
        font-size: 20px;
        color: #272729;
        margin-top: 10px;
    }
    .form-button-group {
        margin-top: 25px;
    }
    > .transfer-amount, .estimated-fees {
        margin-top: 30px;
    }
`;

export default ({
    onClickPrimary,
    onClickSecondary,
    transferAmount,
    gasFeeAmount,
    sender,
    receiver,
    creatingNewAccount
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <div><Translate id='existingAccount.fundNewAccount.titleOne' /></div>
            <h3><Translate id='existingAccount.fundNewAccount.titleTwo' /></h3>
            <TransferAmount
                transferAmount={transferAmount}
                gasFeeAmount={gasFeeAmount}
                sender={sender}
                receiver={receiver}
            />
            <EstimatedFees
                gasFeeAmount={gasFeeAmount}
            />
            {/* FIX: Handle not enough balance */}
            <FormButtonGroup
                onClick={{
                    primary: onClickPrimary,
                    secondary: onClickSecondary
                }}
                disabled={{
                    primary: creatingNewAccount,
                    secondary: creatingNewAccount
                }}
                color={{
                    secondary: 'gray-blue'
                }}
                translateId={{
                    primary: 'button.approve',
                    secondary: 'button.cancel'
                }}
            />
        </StyledContainer>
    );
};