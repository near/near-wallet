import React, { useEffect, useReducer, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ShieldIcon from '../../images/icon-shield.svg';
import ImportArrow from '../../images/import-arrow.svg';
import { selectAvailableAccounts, selectAvailableAccountsIsLoading } from '../../redux/slices/availableAccounts';
import FormButton from '../common/FormButton';
import FormButtonGroup from '../common/FormButtonGroup';
import Modal from '../common/modal/Modal';
import Container from '../common/styled/Container.css';
import AccountListImport from './AccountListImport';


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
`;

const ModalContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;

    .top-icon {
      height: 60px;
      width: 60px;
      margin-bottom: 40px;
    }

    .desc {
      padding: 0 45px;
      text-align: center;
      margin-top: 24px;
      p {
        margin: 0;
      }
    }

    .button-group, button {
      align-self: stretch;
      margin-top: 48px !important;
    }
`;

const KEY_TYPES = {
  LEDGER: 'ledger',
  MULTISIG: 'multisig',
  FAK: 'fullAccessKey'
};

const ACTIONS = {
  BEGIN_IMPORT: 'BEGIN_IMPORT',
  SET_CURRENT_DONE: 'SET_CURRENT_DONE',
  SET_CURRENT_FAILED: 'SET_CURRENT_FAILED',
  CONFIRM_URL: 'CONFIRM_URL',
  REMOVE_ACCOUNTS: 'REMOVE_ACCOUNTS'
};

const IMPORT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  UP_NEXT: 'waiting',
  FAILED: 'error'
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.REMOVE_ACCOUNTS:
            return {
                ...state,
                accounts: state.accounts.filter(
                    (account) =>
                        !action.accounts.some(
                            (accountId) => account.accountId === accountId
                        )
                ),
            };
        case ACTIONS.BEGIN_IMPORT:
            return state.accounts.every(({ status }) => status === null)
                ? {
                      accounts: state.accounts.map((acc, idx) => ({
                          ...acc,
                          status:
                              idx === 0
                                  ? IMPORT_STATUS.PENDING
                                  : IMPORT_STATUS.UP_NEXT,
                      })),
                      urlConfirmed: false,
                  }
                : state;
        case ACTIONS.SET_CURRENT_DONE: {
            let currentIndex = state.accounts.findIndex(
                (account) => account.status === IMPORT_STATUS.PENDING
            );
            return {
                accounts: state.accounts.map((acc, idx) => ({
                    ...acc,
                    status:
                        idx === currentIndex
                            ? IMPORT_STATUS.SUCCESS
                            : idx === currentIndex + 1
                            ? IMPORT_STATUS.PENDING
                            : state.accounts[idx].status,
                })),
                urlConfirmed: true,
            };
        }
        case ACTIONS.SET_CURRENT_FAILED: {
            let currentIndex = state.accounts.findIndex(
                (account) => account.status === IMPORT_STATUS.PENDING
            );
            return {
                accounts: state.accounts.map((acc, idx) => ({
                    ...acc,
                    status:
                        idx === currentIndex
                            ? IMPORT_STATUS.FAILED
                            : idx === currentIndex + 1
                            ? IMPORT_STATUS.PENDING
                            : state.accounts[idx].status,
                })),
                urlConfirmed: true,
            };
        }
        case ACTIONS.CONFIRM_URL:
            return {
                ...state,
                urlConfirmed: true,
            };
        default:
            return state;
    }
};

/**TODO
 * Add success screen
 * get key type on mount modal
 * handle import based on key type
 * condition UI for import tx based on key type (hide transaction details and estimated fees if not FAK)
 * Add remaining UI e.g. text above list and X icon for error state
 */

const BatchImportAccounts = ({ accountIdToKeyMap, onCancel }) => {
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);
    const availableAccounts = useSelector(selectAvailableAccounts);

    const [state, dispatch] = useReducer(reducer, {
        accounts: Object.keys(accountIdToKeyMap).map((accountId) => ({
            accountId,
            status: null,
            key: accountIdToKeyMap[accountId],
        })),
    });
    const currentAccount = state.accounts.find((account) => account.status === IMPORT_STATUS.PENDING);
    const accountsApproved = state.accounts.reduce((acc, curr) => curr.status === IMPORT_STATUS.SUCCESS ? acc + 1 : acc,0);
    const completed = state.accounts.every((account) => account.status === IMPORT_STATUS.SUCCESS || account.status === IMPORT_STATUS.FAILED);
    const showSuccessScreen = completed && state.accounts.some((account) => account.status === IMPORT_STATUS.SUCCESS);

    useEffect(() => {
      if (!currentAccount) {
        dispatch({type: ACTIONS.REMOVE_ACCOUNTS, accounts: availableAccounts});
      }
    },[availableAccounts]);

    return showSuccessScreen ? null : (
        <>
            <Container className="small-centered border ledger-theme">
                <img src={ImportArrow} alt="ImportArrow" />
                <CustomContainer>
                    <div className="title">
                        {accountsApproved}/{state.accounts.length} <Translate id="signInLedger.modal.accountsApproved" />
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
                        onClose={()=>{}}
                        disableClose
                    >
                        <ModalContainer>
                            <img
                                src={ShieldIcon}
                                alt="SHIELD"
                                className="top-icon"
                            />
                            <h3>
                                <Translate id="batchImportAccounts.confirmModal.title" />
                            </h3>
                            <div className="desc">
                                <p>
                                    <Translate id="batchImportAccounts.confirmModal.desc" />
                                </p>
                            </div>
                            <FormButton
                                onClick={() =>
                                    dispatch({ type: ACTIONS.CONFIRM_URL })
                                }
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

const AccountImportModal = ({ account, onSuccess, onFail }) => {
  const [keyType, setKeyType] = useState(null);

  useEffect(() => {
    // logic to fetch key type
    setKeyType(KEY_TYPES.MULTISIG);
  },[keyType]);

  return (
      <Modal
          isOpen={account}
          modalSize="sm"
          modalClass="slim"
          onClose={()=>{}}
          disableClose
      >
          <ModalContainer>
              <img src={ShieldIcon} alt="SHIELD" className="top-icon" />
              <h3>
                  <Translate id="batchImportAccounts.confirmModal.title" />
              </h3>
              <div className="desc">
                  <p>
                      <Translate id="batchImportAccounts.confirmModal.desc" />
                  </p>
              </div>
              <FormButtonGroup>
                  <FormButton
                      onClick={onFail}
                      className="gray-blue"
                  >
                      <Translate id="button.cancel" />
                  </FormButton>
                  <FormButton
                      onClick={onSuccess}
                      // disabled={!keyType}
                  >
                      <Translate id="button.approve" />
                  </FormButton>
              </FormButtonGroup>
          </ModalContainer>
      </Modal>
  );
};

export default BatchImportAccounts;
