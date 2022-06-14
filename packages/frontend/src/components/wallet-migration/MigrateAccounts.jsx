import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import IconAccount from '../../images/wallet-migration/IconAccount';
import IconMigrateAccount from '../../images/wallet-migration/IconMigrateAccount';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';

const PageContainer = styled(Container)`
    width: 100%;
    margin-top: 107px;
    max-width: 431px;
    border: 1px solid #F0F0F1;
    border-radius: 8px;

    header{
        padding: 24px 24px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .title{
            font-size: 20px;
            margin-top: 56px;
        }
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

    &:not(:first-child) {
        border-top: 1px solid #EDEDED;
    }

    svg{
        margin-right: 9px;
    }
`;

const ButtonsContainer = styled.div`
    text-align: center;
    width: 100% !important;
    display: flex;
    padding: 56px 24px 24px;
    border-top: 1px solid #EDEDED;
`;

const StyledButton = styled(FormButton)`
    width: calc((100% - 16px) / 2);

    &:last-child{
        margin-left: 16px !important;
    }
`;



const MigrateAccounts = () => {
    const availableAccounts = useSelector(selectAvailableAccounts);

  return (
    <PageContainer>
        <header>
            <IconMigrateAccount/>
            <h3 className='title'><Translate  id="walletMigration.migrateAccounts.title" data={{count: availableAccounts.length}}/></h3>
            <p><Translate id="walletMigration.migrateAccounts.desc"/></p>
        </header>

        <AccountListing>
            {availableAccounts.map((account) => {
                return <AccountListingItem>
                         <IconAccount/> {account}
                     </AccountListingItem>;
            })}
        </AccountListing>
                      
        <ButtonsContainer>
            <StyledButton className="gray-blue" onClick={()=>{}}>
                <Translate id='button.cancel' />
            </StyledButton>
            <StyledButton onClick={()=>{}}>
                <Translate id='button.continue' />
            </StyledButton>
        </ButtonsContainer>
    </PageContainer>
  );
};

export default MigrateAccounts;
