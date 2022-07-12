import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Checkbox from '../../../common/Checkbox';
import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import AccountFunded from '../status/AccountFunded';

const StyledContainer = styled(Container)`
    &&& {
        h2 {
            margin-bottom: 40px;
        }
    
        .checkbox-wrapper {
            border: 1px solid #F0F0F1;
            background-color: #FAFAFA;
            border-radius: 8px;
            padding: 15px;
            margin-top: 50px;
    
            > div {
                font-weight: 700;
                margin-bottom: 25px;
                color: #3F4045;
            }
    
            label {
                cursor: pointer;
                > span {
                    margin-left: 15px;
                    font-size: 14px;
                    color: #72727A;
                }
            }
        }
    
        > button {
            width: 100%;
            margin-top: 45px;
        }
    }
`;

export default ({
    initialDeposit,
    accountId,
    onClaimAccount,
    claimingAccount
}) => {
    const [newAddressApproved, setNewAddressApproved] = useState(false);
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='initialDeposit.claimAccount.title' /></h1>
            <h2><Translate id='initialDeposit.claimAccount.desc' /></h2>
            <AccountFunded
                initialDeposit={initialDeposit}
                accountId={accountId}
            />
            <div className='checkbox-wrapper'>
                <div>
                    <Translate id='initialDeposit.claimAccount.disclaimer.desc' />
                </div>
                <label>
                    <Checkbox
                        checked={newAddressApproved}
                        onChange={(e) => setNewAddressApproved(e.target.checked)}
                    />
                    <span><Translate id='initialDeposit.claimAccount.disclaimer.checkBox' /></span>
                </label>
            </div>
            <FormButton
                disabled={!newAddressApproved || claimingAccount}
                sending={claimingAccount}
                onClick={onClaimAccount}
            >
                <Translate id='button.claimMyAccount' />
            </FormButton>
        </StyledContainer>
    );
};
