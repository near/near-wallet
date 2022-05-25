import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Checkbox from '../common/Checkbox';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';

const Container = styled.div`
    padding: 15px 0;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 30px 75px;
    }

    h2 {
        text-align: center;
    }

    ul, li {
        color: #0072ce;
    }

    ul {
        padding-inline-start: 24px;
        margin-bottom: 50px;
    }

    li {
        margin: 10px 0;
    }

    .sub-title {
        margin-top: 25px;
    }

    button {
        width: 100% !important;
        margin-top: 40px !important;

        &.red {
            display: block !important;
            margin: 30px auto 0 auto !important;
        }
    }

    label {
        cursor: pointer;
        margin-top: 20px;
        display: flex;
        color: #A1A1A9;
        max-width: 450px;

        > span {
            margin-left: 8px;
        }
    }

`;

type TermsModalProps = {
    open: boolean;
    onClose:()=> void; 
    termsChecked: boolean;
    privacyChecked: boolean; 
    handleTermsChange: ()=> void;
    handlePrivacyChange:()=> void;
    handleFinishSetup: ()=> void;
    loading: boolean;
}

const TermsModal = ({ open, onClose, termsChecked, privacyChecked, handleTermsChange, handlePrivacyChange, handleFinishSetup, loading }:TermsModalProps) => {
    return (
        <Modal
            id='terms-modal'
            isOpen={open}
            onClose={onClose}
            disableClose={true}
        >
            <Container>
                <h2><Translate id='createAccount.terms.title'/></h2>
                <div className='sub-title'><Translate id='createAccount.terms.desc'/></div>
                <ul>
                    <li><a href='/terms' rel='noopener noreferrer' target='_blank'><Translate id='createAccount.terms.termsLink'/></a></li>
                    <li><a href='https://near.org/privacy' rel='noopener noreferrer' target='_blank'><Translate id='createAccount.terms.privacyLink'/></a></li>
                </ul>
                <label>
                    <Checkbox
                        checked={termsChecked}
                        onChange={handleTermsChange}
                    />
                    <span><Translate id='createAccount.terms.termsCheck'/></span>
                </label>
                <label>
                    <Checkbox
                        checked={privacyChecked}
                        onChange={handlePrivacyChange}
                    />
                    <span><Translate id='createAccount.terms.privacyCheck'/></span>
                </label>
                <FormButton disabled={!termsChecked || !privacyChecked} onClick={handleFinishSetup}>
                    <Translate id='createAccount.terms.agreeBtn' />
                </FormButton>
                <FormButton color='link red' onClick={onClose}>
                    <Translate id='createAccount.terms.declineBtn' />
                </FormButton>
            </Container>
        </Modal>
    );
};

export default TermsModal;
