import React, {useCallback, useState} from 'react';
import { Translate } from 'react-localize-redux';
import styled, { css } from 'styled-components';

import IconAccount from '../../images/wallet-migration/IconAccount';
import IconMigrateAccount from '../../images/wallet-migration/IconMigrateAccount';
import { wallet } from '../../utils/wallet';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';


const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 56px 24px 24px;
    }

    .title {
        margin-top: 40px;
    }
`;

const AccountListing = styled.div`
    margin-top: 56px;
    border-top: 1px solid #EDEDED;
`;

const AccountListingItem = styled.div`
    display: flex;
    align-items: center;
    padding: 16px 32px;
    cursor: pointer;
    overflow: hidden;
    
    ${(props) => props.isSelected && css`
      background-color: rgb(214, 237, 255);
    `}

    &:not(:first-child) {
        border-top: 1px solid #EDEDED;
    }

    svg {
        flex-shrink: 0;
        margin-right: 9px;
    }
`;

const ButtonsContainer = styled.div`
    text-align: center;
    width: 100% !important;
    display: flex;
    padding: 12px 24px 24px;
    border-top: 1px solid #EDEDED;
`;

const StyledButton = styled(FormButton)`
    width: calc((100% - 16px) / 2);

    &:last-child {
        margin-left: 16px !important;
    }
`;

const MigrateAccounts = ({ accounts, onContinue, onClose }) => {
    const [selectedAccountId, setSelectedAccountId] = useState(wallet.accountId);

    const handleAccountSelect = useCallback(({ currentTarget }) => {
        const { accountid }  = currentTarget.dataset;
        setSelectedAccountId(accountid);
    }, []);

    const handleContinueClick = useCallback(async () => {
        onContinue(selectedAccountId);

    }, [selectedAccountId]);

  return (
      <Modal
          modalClass='slim'
          id='migration-modal'
          isOpen
          disableClose
          onClose={onClose}
          modalSize='md'
          style={{ maxWidth: '496px' }}
      >
          <Container>
            <IconMigrateAccount/>
            <h3 className='title'>
                <Translate  id='walletMigration.migrateAccounts.title' data={{count: accounts.length}}/>
            </h3>
            <p>
                <Translate id='walletMigration.migrateAccounts.desc'/>
            </p>
            <AccountListing>
                {
                    accounts.map((account) => (
                        <AccountListingItem
                            key={account}
                            isSelected={account === selectedAccountId}
                            data-accountid={account}
                            onClick={handleAccountSelect}>
                            <IconAccount/> {account}
                        </AccountListingItem>
                    ))
                }
            </AccountListing>

            <ButtonsContainer>
                <StyledButton className='gray-blue' onClick={onClose}>
                    <Translate id='button.cancel' />
                </StyledButton>
                <StyledButton
                    disabled={!Boolean(selectedAccountId)}
                    onClick={handleContinueClick}>
                    <Translate id='button.continue' />
                </StyledButton>
            </ButtonsContainer>
          </Container>
          </Modal>
  );
};

export default MigrateAccounts;
