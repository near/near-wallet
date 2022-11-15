import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconAccount from '../../../../images/wallet-migration/IconAccount';
import IconMigrateAccount from '../../../../images/wallet-migration/IconMigrateAccount';
import { ButtonsContainer, StyledButton, MigrationModal, Container } from '../../CommonComponents';

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

    &:not(:first-child) {
        border-top: 1px solid #EDEDED;
    }

    svg {
        flex-shrink: 0;
        margin-right: 9px;
    }
`;

const MigrateAccounts = ({ accounts, onClose, onContinue }) => {
   
    return (
        <MigrationModal
            onClose={onClose}
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
                                data-accountid={account}>
                                <IconAccount/> {account}
                            </AccountListingItem>
                        ))
                    }
                </AccountListing>

                <ButtonsContainer>
                    <StyledButton className='gray-blue' onClick={onClose}>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    <StyledButton onClick={onContinue}>
                        <Translate id='button.continue' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};

export default MigrateAccounts;
