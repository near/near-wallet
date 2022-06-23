import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmerReducer } from 'use-immer';

import ShieldIcon from '../../../images/icon-shield.svg';
import ImportArrow from '../../../images/import-arrow.svg';
import { selectAccountUrlReferrer } from '../../../redux/slices/account';
import { selectAvailableAccounts, selectAvailableAccountsIsLoading } from '../../../redux/slices/availableAccounts';
import { decodeAccountsFrom } from '../../../utils/encoding';
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

const PublicKeyFormContainer = styled.div`
    padding: 15px 0 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    label {
        text-align: left;
        display: flex;
        background-color: #F5FAFF;
        margin: 25px -25px 0 -25px;
        padding: 15px 25px;
        line-height: 1.5;

        > div {
            > div {
                border-color: #0081F1;
            }
        }

        > span {
            margin-left: 10px;
            word-break: break-word;
            color: #006ADC;
        }

        b {
            color: #272729;
        }
    }

    > button {
        width: 100%;
    }
`;

const Title = styled.h3`
    margin: 15px 0;
    font-size: 18px;
    font-weight: 700;
`;

const Description = styled.p`
    line-height: 1.5;
    font-size: 14px;
`;

export const IMPORT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  UP_NEXT: 'waiting',
  FAILED: 'error'
};

const EnterPublicKeyForm = ({ onCancel, onPublicKey }) => {
    const [value, setValue] = useState('');
    const handleInputChange = useCallback(({ currentTarget }) => {
        setValue(currentTarget.value);
    }, []);

    const handleSubmit = useCallback(() => {
        onPublicKey(value);
    }, [value]);

    return (
        <Modal
            isOpen
            disableClose
            modalSize='md'
            style={{ maxWidth: '496px' }}
        >
            <PublicKeyFormContainer>
                <Title><Translate id='batchImportAccounts.enterKeyForm.title' /></Title>
                <Description><Translate id='batchImportAccounts.enterKeyForm.desc' /></Description>
                <Translate>
                    {({ translate }) => (
                        <>
                            <input
                                placeholder={translate('batchImportAccounts.enterKeyForm.placeholder')}
                                onChange={handleInputChange}
                                value={value}
                                autoCapitalize='off'
                                spellCheck='false'
                                autoFocus
                            />
                        </>
                    )}
                </Translate>
                <FormButton
                    disabled={value.length === 0}
                    type='submit'
                    onClick={handleSubmit}>
                    <Translate id='batchImportAccounts.enterKeyForm.importCaption' />
                </FormButton>
                <FormButton
                    className='link'
                    onClick={onCancel}>
                    <Translate id='button.cancel' />
                </FormButton>
            </PublicKeyFormContainer>
        </Modal>
    );
};

const ImportAccounts = ({ accountsData, onCancel }) => {
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);
    const [state, dispatch] = useImmerReducer(reducer, {
        accounts: accountsData.map(([accountId, key, ledgerHdPath]) => ({
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

    const accounts = state.accounts.filter(({ accountId }) => Boolean(accountId));
    return (
        <>
            <Container className='small-centered border ledger-theme'>
              <CustomContainer>
                  <img src={ImportArrow} alt='ImportArrow' />
                  <div className='screen-descripton'>
                    <h3>
                      <Translate id='batchImportAccounts.importScreen.title' data={{ noOfAccounts: accounts.length }}/>
                      {accountUrlReferrer || <Translate id='sign.unknownApp' />}
                    </h3>
                    <br />
                    <br />
                    <Translate id='batchImportAccounts.importScreen.desc'/>
                  </div>
                    <div className='title'>
                        {accountsApproved.length}/{accounts.length}{' '}
                        <Translate id='signInLedger.modal.accountsApproved' />
                    </div>
                    <AccountListImport accounts={accounts} />
                    <div style={{ borderTop: '2px solid #f5f5f5' }} />
                    <FormButtonGroup>
                        <FormButton
                            onClick={onCancel}
                            className='gray-blue'
                            disabled={availableAccountsIsLoading}
                        >
                            <Translate id='button.cancel' />
                        </FormButton>
                        <FormButton
                            onClick={() =>
                                dispatch({ type: ACTIONS.BEGIN_IMPORT })
                            }
                            disabled={availableAccountsIsLoading}
                        >
                            <Translate id='button.beginImport' />
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
                        modalSize='sm'
                        modalClass='slim'
                        onClose={() => {}}
                        disableClose
                    >
                        <ModalContainer>
                            <img
                                src={ShieldIcon}
                                alt='SHIELD'
                                className='top-icon'
                            />
                            <h3>
                                <Translate id='batchImportAccounts.confirmUrlModal.title' />
                            </h3>
                            <div className='desc'>
                                <p>
                                    <Translate id='batchImportAccounts.confirmUrlModal.desc' />
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
                                <Translate id='button.looksGood' />
                            </FormButton>
                        </ModalContainer>
                    </Modal>
                )
            ) : null}
        </>
    );
};

const BatchImportAccounts = ({ onCancel }) => {
    const [accountsData, setAccountsData] = useState(null);

    const handlePublicKey = useCallback((publicKey) => {
        setAccountsData(decodeAccountsFrom(location.hash, publicKey));
    }, []);

    if (!accountsData) {
        return <EnterPublicKeyForm
            onCancel={onCancel}
            onPublicKey={handlePublicKey} />;
    }

    return <ImportAccounts
        accountsData={accountsData}
        onCancel={onCancel} />;
};

export default BatchImportAccounts;
