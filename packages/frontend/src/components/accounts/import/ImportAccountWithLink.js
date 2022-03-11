import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import ClickToCopy from '../../common/ClickToCopy';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import UserIcon from '../../svg/UserIcon';

const StyledContainer = styled(Container)`
    &&& {
        text-align: center;

        h2 {
            button {
                font-weight: normal;
            }
        }
        
        .copy {
            display: inline;

            button {
                cursor: copy;
            }
        }

        .counter {
            font-size: 12px;
            color: #A2A2A8;
            text-align: left;
        }

        .accounts-wrapper {
            margin-top: 20px;
        }
    
        .accounts {
            margin: 0 -40px -20px -40px;
            border-top: 1px solid #F0F0F1;

            @media (max-width: 767px) {
                margin: 0 -14px -20px -14px;
            }
        }
    
        .account {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #24272A;
            border-bottom: 1px solid #F0F0F1;
            padding: 20px 40px;

            @media (max-width: 767px) {
                padding: 20px 14px;
            }

            :last-child {
                border-bottom: 0;
                margin-bottom: -40px;
            }

            svg {
                margin-right: 10px;
            }
    
            button {
                margin: 0;
                padding: 8px 24px;
                height: auto;
                white-space: nowrap;
                width: auto;
            }
    
            > div {
                display: flex;
                align-items: center;
                overflow: hidden;
                width: 100%;

                 > div {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    max-width: 70%;
                    white-space: nowrap;
                 }
            }
        }
    }
`;

export default ({
    accountsBySeedPhrase,
    onClickAccount,
    importingAccount
}) => {

    const numberOfAccountsFound = accountsBySeedPhrase.length;

    const getAccountsStatus = () => {
        if (numberOfAccountsFound === 1 && accountsBySeedPhrase[0].imported === true) {
            return <h2><Translate id='importAccountWithLink.alreadyImported' /></h2>;
        }

        if (numberOfAccountsFound !== 1) {
            return <h2><Translate id='importAccountWithLink.foundAccounts' data={{ count: numberOfAccountsFound }} /></h2>;
        }

        return <h2><Translate id='importAccountWithLink.foundAccount' /></h2>;
    };

    return (
        <StyledContainer className='small-centered border'>
            <h3><Translate id='importAccountWithLink.importAccount' /></h3>

            {getAccountsStatus()}

            <h2>
                <Translate id='importAccountWithLink.preferedBrowser' />&nbsp;
                <ClickToCopy copy={window.location.href} className='copy'>
                    <FormButton className='link underline'>
                        <Translate id='importAccountWithLink.copyUrl' />
                    </FormButton>
                </ClickToCopy>&nbsp;
                <Translate id='importAccountWithLink.continue' />
            </h2>
            <div className='counter'>
                {numberOfAccountsFound !== 1
                    ? <Translate id='importAccountWithLink.accountsFound' data={{ count: numberOfAccountsFound }} />
                    : <Translate id='importAccountWithLink.accountFound' />
                }
            </div>
            {
                numberOfAccountsFound > 0 && (
                    <div className='accounts-wrapper'>
                        <div className='accounts'>
                            {accountsBySeedPhrase.map((account) => (
                                <div className='account' key={account.accountId}>
                                    <div>
                                        <UserIcon background={true} />
                                        <div>{account.accountId}</div>
                                    </div>
                                    <FormButton
                                        color={accountsBySeedPhrase.some((account) => account.imported) && !account.imported ? 'gray-blue' : 'blue'}
                                        disabled={!!importingAccount}
                                        sending={importingAccount === account.accountId}
                                        sendingString='importing'
                                        onClick={() => {
                                            onClickAccount({
                                                accountId: account.accountId,
                                                action: account.imported ? 'select' : 'import'
                                            });
                                        }}
                                    >
                                        {account.imported
                                            ? <Translate id='importAccountWithLink.goToAccount' />
                                            : <Translate id='importAccountWithLink.import' />
                                        }
                                    </FormButton>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </StyledContainer>
    );
};
