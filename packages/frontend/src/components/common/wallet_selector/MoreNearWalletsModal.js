import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import AlertTriangleIcon from '../../svg/AlertTriangleIcon';
import FormButton from '../FormButton';
import Modal from '../modal/Modal';
import ModalFooter from '../modal/ModalFooter';

const StyledContainer = styled.div`
    .more-wallets-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        h3 {
            margin: 25px 0;
        }

        p {
            margin-top: 0;
            line-height: 21px;
        }
    }

    .alert-triangle {
        margin-top: 40px;
        background-color: #FFF8F8;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        > svg {
            min-width: 21px;
            min-height: 21px;
        }
    }

    && {
        .modal-footer {
            display: flex;
            flex-direction: column;
    
            button {
                &.link {
                    margin-top: 20px;
                }
            }
        }
    }
`;

const MoreNearWalletsModal = ({ open, onClose, onClickSeeMoreWallets }) => {
    return (
        <Modal
            id='more-near-wallets-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
            modalSize='sm-md'
        >
            <StyledContainer>
                <div className='more-wallets-body'>
                    <div className='alert-triangle'><AlertTriangleIcon color='#E5484D' /></div>
                    <h3><Translate id='moreNearWalletsModal.title' /></h3>
                    <p><Translate id='moreNearWalletsModal.desc' /></p>
                </div>
                <ModalFooter>
                    <FormButton onClick={onClickSeeMoreWallets}>
                        <Translate id='moreNearWalletsModal.primaryButton' />
                    </FormButton>
                    <FormButton color='link' id='close-button'>
                        <Translate id='button.dismiss' />
                    </FormButton>
                </ModalFooter>
            </StyledContainer>
        </Modal>
    );
};

export default MoreNearWalletsModal;
