import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
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
        margin-top: 10px;
    }
    .button-group {
        margin-top: 25px;
    }
    > .transfer-amount, .estimated-fees {
        margin-top: 30px;
    }
`;

type FundNewAccountProps = {
    onClickApprove:()=>void;
    onClickCancel:()=> void;
    transferAmount:string;
    gasFeeAmount:string;
    sender:string;
    receiver:string;
    creatingNewAccount:boolean;
    hasAllRequiredParams:boolean;
}

export default ({
    onClickApprove,
    onClickCancel,
    transferAmount,
    gasFeeAmount,
    sender,
    receiver,
    creatingNewAccount,
    hasAllRequiredParams
}) => {
    return (
        <StyledContainer className='small-centered border'>
            <div><Translate id='existingAccount.fundNewAccount.titleOne' /></div>
            <h3><Translate id='existingAccount.fundNewAccount.titleTwo' /></h3>
            <TransferAmount
                transferAmount={transferAmount}
                // gasFeeAmount={gasFeeAmount}
                sender={sender}
                receiver={receiver}
                receiverBalance='0'
            />
            <EstimatedFees
                gasFeeAmount={gasFeeAmount}
            />
            <FormButtonGroup>
                <FormButton
                    onClick={onClickCancel}
                    color='gray-blue'
                    disabled={creatingNewAccount}
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickApprove}
                    disabled={creatingNewAccount || !hasAllRequiredParams}
                    sending={creatingNewAccount}
                >
                    <Translate id='button.approve' />
                </FormButton>
            </FormButtonGroup>
        </StyledContainer>
    );
};
