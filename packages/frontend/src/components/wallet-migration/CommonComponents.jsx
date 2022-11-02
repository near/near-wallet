import React from 'react';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';

export const ButtonsContainer = styled.div`
  text-align: center;
  width: 100% !important;
  display: flex;
  ${(props) => (props.vertical && 'flex-direction: column;')}
  @media (max-width: 650px) {
    flex-direction: column;
  }
  padding-top: 48px;
`;

export const StyledButton = styled(FormButton)`
  flex: 1;
  ${(props) => (props.fullWidth ? 'width: 100%': '' )}
  margin: 0 5px !important;
  @media (max-width: 650px) {
    flex-direction: column;
    padding: 18px;
	align-items: center;
    &:last-child{
      	margin-top: 16px !important;
    }
  }
`;

export const MigrationModal = ({ children, isOpen = true, onClose = () => {}, disableClose = true }) => {
    return (
        <Modal
            modalClass="slim"
            id='migration-modal'
            isOpen={isOpen}
            disableClose={disableClose}
            modalSize='md'
            style={{ maxWidth: '435px' }}
            onClose={onClose}
        >
            {children}
        </Modal>
    );
};
