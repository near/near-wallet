import React from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { redirectTo, switchAccount } from '../../redux/actions/account';
import { selectAccountUrlReferrer } from '../../redux/slices/account';
import Container from '../common/styled/Container.css';
import AvatarSuccessIcon from '../svg/AvatarSuccessIcon';
import AccountListImport from './AccountListImport';

const CustomContainer = styled.div`
      width: 100%;
      .title {
          text-align: left;
          font-size: 12px;
      }

      .screen-descripton {
        margin-top: 40px;
        margin-bottom: 56px;
      }

      svg {
        margin-bottom: 0;
      }
`;

const BatchImportAccountsSuccessScreen = ({ accounts = [] }) => {
  const dispatch = useDispatch();
  const accountUrlReferrer = useSelector(selectAccountUrlReferrer);

  return (
    <Container className="small-centered border ledger-theme">
      <CustomContainer>
          <AvatarSuccessIcon />
          <div className='screen-descripton'>
            <h3>
              <Translate id="batchImportAccounts.successScreen.title" data={{ noOfAccounts: accounts.length }}/>
              {accountUrlReferrer || <Translate id="sign.unknownApp" />}
            </h3>
            <br />
            <br />
            <Translate id="batchImportAccounts.successScreen.desc"/>
          </div>
          <div className="title">
             {accounts.length} <Translate id="signInLedger.modal.accountsApproved" />
          </div>
          <AccountListImport accounts={accounts} onClickAccount={async ({accountId}) => {
              await dispatch(switchAccount({accountId}));
              dispatch(redirectTo('/'));
            }} 
          />
      </CustomContainer>
    </Container>
  );
};

export default BatchImportAccountsSuccessScreen;
