import { partition } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmerReducer } from 'use-immer';

import { NETWORK_ID } from '../../../config';
import { selectAvailableAccountsIsLoading } from '../../../redux/slices/availableAccounts';
import WalletClass, { wallet } from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Container from '../../common/styled/Container.css';
import LedgerImageCircle from '../../svg/LedgerImageCircle';
import AccountListImport from '../AccountListImport';
import { IMPORT_STATUS } from '../batch_import_accounts';
import BatchImportAccountsSuccessScreen from '../batch_import_accounts/BatchImportAccountsSuccessScreen';
import reducer, { ACTIONS } from '../batch_import_accounts/sequentialAccountImportReducer';
import AccountExportModal from './AccountExportModal';

const CustomContainer = styled.div`
    width: 100%;
    margin-top: 40px;

    .buttons-bottom-buttons {
        margin-top: 40px;
    }

    .title {
        text-align: left;
        font-size: 12px;
    }

    .screen-descripton {
      margin-top: 40px;
      margin-bottom: 56px;
    }
`;

const BatchLedgerExport = ({ onCancel }) => {
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);
    const [, setLedgerAccounts] = useState([]);

    const [state, dispatch] = useImmerReducer(reducer, {
        accounts: []
    });

    useEffect(() => {
        const addAccountsToList = async () => {
            const accounts = await wallet.keyStore.getAccounts(NETWORK_ID);
            const getAccountWithAccessKeysAndType = async (accountId) => {
                const keyType = await wallet.getAccountKeyType(accountId);
                const accessKeys = await wallet.getAccessKeys(accountId);
                return {accountId, accessKeys, keyType};
            };
            const accountsWithKeys = await Promise.all(
                accounts.map(getAccountWithAccessKeysAndType)
            );
            const [ledgerAccounts, nonLedgerAccounts] = partition(
                accountsWithKeys,
                ({ keyType, accessKeys }) =>
                    keyType === WalletClass.KEY_TYPES.LEDGER ||
                    accessKeys.some(
                        (accessKey) => accessKey.meta.type === 'ledger'
                    )
            );
            setLedgerAccounts(ledgerAccounts);
            dispatch({type: ACTIONS.ADD_ACCOUNTS, accounts: nonLedgerAccounts.map(({accountId, keyType}) => ({
                accountId,
                status: null,
                keyType
            }))});
        };
        addAccountsToList();
    },[]);

    const currentAccount = useMemo(() => state.accounts.find((account) => account.status === IMPORT_STATUS.PENDING), [state.accounts]);
    const accountsApproved = useMemo(() => state.accounts.filter((account) => account.status === IMPORT_STATUS.SUCCESS), [state.accounts]);
    const completed = useMemo(() => state.accounts.every((account) => account.status === IMPORT_STATUS.SUCCESS || account.status === IMPORT_STATUS.FAILED), [state.accounts]);
    const showSuccessScreen = useMemo(() => completed && state.accounts.some((account) => account.status === IMPORT_STATUS.SUCCESS), [completed, state.accounts]);

    if (showSuccessScreen) {
        return <BatchImportAccountsSuccessScreen accounts={accountsApproved} />;
    }

    return (
        <>
            <Container className="small-centered border ledger-theme">
              <CustomContainer>
                  <LedgerImageCircle color='#D6EDFF' />
                  <div className='screen-descripton'>
                    <h3>
                      <Translate id="batchExportAccounts.exportScreen.weFound" data={{ noOfAccounts: state.accounts.length }}/>
                    </h3>
                    <br />
                    <br />
                    <Translate id="batchExportAccounts.exportScreen.desc"/>
                  </div>
                    <div className="title">
                        {accountsApproved.length}/{state.accounts.length}{' '}
                        <Translate id="signInLedger.modal.accountsApproved" />
                    </div>
                    <AccountListImport accounts={state.accounts} />
                    <div style={{ borderTop: '2px solid #f5f5f5' }} />
                    <FormButtonGroup>
                        <FormButton
                            onClick={onCancel}
                            className="gray-blue"
                            disabled={availableAccountsIsLoading}
                        >
                            <Translate id="button.cancel" />
                        </FormButton>
                        <FormButton
                            onClick={() =>
                                dispatch({ type: ACTIONS.BEGIN_IMPORT })
                            }
                            disabled={availableAccountsIsLoading || completed}
                        >
                            <Translate id="button.beginExport" />
                        </FormButton>
                    </FormButtonGroup>
                </CustomContainer>
            </Container>
            {currentAccount ? (
                <AccountExportModal
                    account={currentAccount}
                    onSuccess={() =>
                        dispatch({ type: ACTIONS.SET_CURRENT_DONE })
                    }
                    onFail={() =>
                        dispatch({ type: ACTIONS.SET_CURRENT_FAILED })
                    }
                />
            ) : null}
        </>
    );
};

export default BatchLedgerExport;
