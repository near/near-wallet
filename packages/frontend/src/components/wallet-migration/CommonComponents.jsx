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
    justify-content: space-between;
`;

export const StyledButton = styled(FormButton)`
    min-width: 165px;
    ${(props) => (props.fullWidth ? `
        width: 100%;
        flex-direction: column;
        padding: 18px;
        align-items: center;
        &:not(:first-child){
            margin-top: 16px !important;
        }
    `: '' )}
    &&& {
        margin: 0px;
    }

    @media (max-width: 650px) {
        width: 100%;
        flex-direction: column;
        padding: 18px;
        align-items: center;
        &:not(:first-child){
            margin-top: 16px !important;
        }
    }
`;

export const MigrationModal = ({ children, isOpen = true, onClose = () => {}, disableClose = true, ...restProps }) => {
    return (
        <Modal
            modalClass="slim"
            id='migration-modal'
            isOpen={isOpen}
            disableClose={disableClose}
            modalSize='md'
            style={{ maxWidth: '435px' }}
            onClose={onClose}
            {...restProps}
        >
            {children}
        </Modal>
    );
};

export const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 56px 24px 24px;
    }

    .title {
        margin-top: 40px;
    }
`;

export const IconBackground = styled.div`
    background-color: #D6EDFF;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
`;
