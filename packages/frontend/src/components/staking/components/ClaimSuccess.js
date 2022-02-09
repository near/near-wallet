import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import TransferMoneyIcon from '../../svg/TransferMoneyIcon';

export const ClaimSuccess = () => {
  return (
    <>
      <TransferMoneyIcon/>
      <h1><Translate id={`staking.claimSuccess.title`} /></h1>
      <div className='desc' data-test-id="stakingSuccessMessage">
          <Translate
              id={`staking.claimSuccess.desc`}
          />
      </div>
      <div className='desc'><Translate id={`staking.claimSuccess.descTwo`}/></div>
      <FormButton 
          linkTo='/staking' 
          className='gray-blue'
          data-test-id="returnToDashboardButton"
      >
          <Translate id={`staking.claimSuccess.button`} />
      </FormButton>
    </>
  );
};