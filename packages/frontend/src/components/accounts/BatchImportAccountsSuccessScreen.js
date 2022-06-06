import React from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { redirectTo, switchAccount } from '../../redux/actions/account';
import Container from '../common/styled/Container.css';
import AvatarSuccessIcon from '../svg/AvatarSuccessIcon';
import AccountListImport from './AccountListImport';

const CustomContainer = styled.div`
      width: 100%;
      margin-top: 40px;

      .title {
          text-align: left;
          font-size: 12px;
      }
`;

const BatchImportAccountsSuccessScreen = ({ accounts = [] }) => {
  const dispatch = useDispatch();

  return (
    <Container className="small-centered border ledger-theme">
      <AvatarSuccessIcon />
      <CustomContainer>
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
