import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import ModalFooter from '../../common/modal/ModalFooter';
import AlertTriangleIcon from '../../svg/AlertTriangleIcon';
import ConnectWithApplication from './ConnectWithApplication';

const StyledContainer = styled.div`
    &&& {
        .upper-body {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;

            .alert-triangle {
                margin: 20px 0 50px 0;
                background-color: #FEF2F2;
                border-radius: 50%;
                width: 64px;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;
                > svg {
                    min-width: 30px;
                    min-height: 30px;
                }
            }

            .connect-with-application {
                margin: 25px 0;
            }

            .desc {
                color: #72727A;
                line-height: 150%;
                margin-bottom: 65px;
            }
        }

        .input-label {
            color: #72727A;
        }
    
        .modal-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
    
            > button {
                width: auto;
                &.link {
                    margin: 20px 35px;
                }
                
                &.blue {
                    padding: 0 35px;
                }
            }
        }
    }
`;

export default ({
    open,
    onClose,
    userInputValue,
    onChangeUserInputValue,
    onConfirm,
    appReferrer,
    signedInAccountId,
    loggingIn
}) => (
    <Modal
        id='grant-full-access-modal'
        isOpen={open}
        onClose={onClose}
        modalSize='md'
    >
        <form onSubmit={e => {
            onConfirm();
            e.preventDefault();
        }}>
            <StyledContainer>
                <div className='upper-body'>
                    <div className='alert-triangle'><AlertTriangleIcon color='#DC1F25' /></div>
                    <h3><Translate id='login.v2.connectConfirm.fullAccessModal.title' /></h3>
                    <ConnectWithApplication appReferrer={appReferrer} />
                    <div className='desc'>
                        <Translate id='login.v2.connectConfirm.fullAccessModal.desc' />
                    </div>
                </div>
                <div className='input-label'><Translate id='input.accountId.title' /></div>
                <Translate>
                    {({ translate }) => (
                        <input
                            placeholder={translate('input.accountId.placeholder')}
                            autoFocus={true}
                            onChange={onChangeUserInputValue}
                            value={userInputValue}
                        />
                    )}
                </Translate>
                <ModalFooter>
                    <FormButton
                        onClick={onClose}
                        color='light-gray'
                        className='link'
                        type='button'
                        disabled={loggingIn}
                    >
                        <Translate id='button.cancel' />
                    </FormButton>
                    <FormButton
                        disabled={signedInAccountId !== userInputValue || loggingIn}
                        onClick={onConfirm}
                        sending={loggingIn}
                        sendingString='button.connecting'
                        type='submit'
                    >
                        <Translate id='button.confirm' />
                    </FormButton>
                </ModalFooter>
            </StyledContainer>
        </form>
    </Modal>
);
