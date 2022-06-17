import React, { useEffect, useMemo } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmerReducer } from 'use-immer';

import ShieldIcon from '../../../images/icon-shield.svg';
import ImportArrow from '../../../images/import-arrow.svg';
import { selectAccountUrlReferrer } from '../../../redux/slices/account';
import { selectAvailableAccounts, selectAvailableAccountsIsLoading } from '../../../redux/slices/availableAccounts';
import getWalletURL from '../../../utils/getWalletURL';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Modal from '../../common/modal/Modal';
import Container from '../../common/styled/Container.css';
import AccountListImport from '../AccountListImport';
import AccountImportModal from './AccountImportModal';
import BatchImportAccountsSuccessScreen from './BatchImportAccountsSuccessScreen';
import reducer, { ACTIONS } from './sequentialAccountImportReducer';
import { ModalContainer } from './styles';

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

export const IMPORT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  UP_NEXT: 'waiting',
  FAILED: 'error'
};

const BatchImportAccounts = ({ accountIdToKeyMap, onCancel }) => {
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);

    const [state, dispatch] = useImmerReducer(reducer, {
        accounts: Object.entries(accountIdToKeyMap).map(
            ([accountId, { key, ledgerHdPath }]) => ({
                accountId,
                status: null,
                key,
                ledgerHdPath,
            })
        ),
    });
    const currentAccount = useMemo(() => state.accounts.find((account) => account.status === IMPORT_STATUS.PENDING), [state.accounts]);
    const accountsApproved = useMemo(() => state.accounts.filter((account) => account.status === IMPORT_STATUS.SUCCESS), [state.accounts]);
    const completed = useMemo(() => state.accounts.every((account) => account.status === IMPORT_STATUS.SUCCESS || account.status === IMPORT_STATUS.FAILED), [state.accounts]);
    const showSuccessScreen = useMemo(() => completed && state.accounts.some((account) => account.status === IMPORT_STATUS.SUCCESS), [completed, state.accounts]);

    useEffect(() => {
      if (!currentAccount) {
        dispatch({type: ACTIONS.REMOVE_ACCOUNTS, accounts: availableAccounts});
      }
    },[availableAccounts, currentAccount]);

    if (showSuccessScreen) {
        return <BatchImportAccountsSuccessScreen accounts={accountsApproved} />;
    }

    return (
        <>
            <Container className="small-centered border ledger-theme">
              <CustomContainer>
                  <img src={ImportArrow} alt="ImportArrow" />
                  <div className='screen-descripton'>
                    <h3>
                      <Translate id="batchImportAccounts.importScreen.title" data={{ noOfAccounts: state.accounts.length }}/>
                      {accountUrlReferrer || <Translate id="sign.unknownApp" />}
                    </h3>
                    <br />
                    <br />
                    <Translate id="batchImportAccounts.importScreen.desc"/>
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
                            <Translate id="button.beginImport" />
                        </FormButton>
                    </FormButtonGroup>
                </CustomContainer>
            </Container>
            {currentAccount ? (
                state.urlConfirmed ? (
                    <AccountImportModal
                        account={currentAccount}
                        onSuccess={() =>
                            dispatch({ type: ACTIONS.SET_CURRENT_DONE })
                        }
                        onFail={() =>
                            dispatch({ type: ACTIONS.SET_CURRENT_FAILED })
                        }
                    />
                ) : (
                    <Modal
                        isOpen={currentAccount}
                        modalSize="sm"
                        modalClass="slim"
                        onClose={() => {}}
                        disableClose
                    >
                        <ModalContainer>
                            <img
                                src={ShieldIcon}
                                alt="SHIELD"
                                className="top-icon"
                            />
                            <h3>
                                <Translate id="batchImportAccounts.confirmUrlModal.title" />
                            </h3>
                            <div className="desc">
                                <p>
                                    <Translate id="batchImportAccounts.confirmUrlModal.desc" />
                                </p>
                                <br />
                                <br />
                                <span className='wallet-url'>{getWalletURL()}</span>
                            </div>
                            <FormButton
                                onClick={() =>
                                    dispatch({ type: ACTIONS.CONFIRM_URL })
                                }
                                style={{ marginTop: 48 }}
                            >
                                <Translate id="button.looksGood" />
                            </FormButton>
                        </ModalContainer>
                    </Modal>
                )
            ) : null}
        </>
    );
};

export default BatchImportAccounts;
