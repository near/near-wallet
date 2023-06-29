import React from 'react';
import { Translate } from 'react-localize-redux';

import StyledContainer from './Style.css';
import Balance from '../../../common/balance/Balance';
import ClickToCopy from '../../../common/ClickToCopy';
import CopyIcon from '../../../svg/CopyIcon';

const AccountNeedsFunding = ({
    accountId,
    fundingAddress,
    minDeposit
}) => {
    return (
        <StyledContainer>
            <div className='address'>
                <div>
                    <Translate id={`account.fundedStatus.${fundingAddress ? 'singleUse' : 'nearName'}`} /> 
                    <ClickToCopy
                        copy={accountId || fundingAddress}
                        className='copy-funding-address'
                    >
                        <CopyIcon/>
                        <Translate id='copy.title' />
                    </ClickToCopy>
                </div>
                <div>
                    {accountId || fundingAddress}
                </div>
            </div>
            <div className='status'>
                <Translate id='account.fundedStatus.status' />
                <span>
                    <Translate id='account.fundedStatus.awaitingDeposit' />
                </span>
            </div>
            <div className='amount'>
                <Translate id='account.fundedStatus.minDeposit' />
                <span>
                    <Balance
                        amount={minDeposit}
                    />
                </span>
            </div>
        </StyledContainer>
    );
};

export default AccountNeedsFunding;
