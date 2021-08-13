import React from 'react';
import { Translate } from 'react-localize-redux';

import Balance from '../../../common/balance/Balance';
import StyledContainer from './Style.css';

const AccountFunded = ({
    accountId,
    fundingAddress,
    initialDeposit
}) => {
    return (
        <StyledContainer className='funded'>
            <div className='address'>
                <div>
                    <Translate id='account.fundedStatus.nearName' />
                </div>
                <div>
                    {accountId || fundingAddress}
                </div>
            </div>
            <div className='status'>
                <Translate id='account.fundedStatus.status' />
                <span>
                    <Translate id={`account.fundedStatus.${fundingAddress ? 'ready' : 'active'}`} /> 
                </span>
            </div>
            <div className='amount'>
                <Translate id='account.fundedStatus.initialDeposit' />
                <span>
                    <Balance
                        amount={initialDeposit}
                    />
                </span>
            </div>
        </StyledContainer>
    );
};

export default AccountFunded;