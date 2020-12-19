import React from 'react'
import Modal from '../common/modal/Modal'
import MobileActionSheet from '../common/modal/MobileActionSheet'
import Checkbox from '../common/Checkbox'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import FormButton from '../common/FormButton'

const Container = styled.div`
    padding: 30px 0;

    @media (min-width: 500px) {
        padding: 30px 75px;
    }

    h2, .sub-title {
        text-align: center;
    }

    .sub-title {
        margin-top: 20px;
    }

    button {
        width: 100% !important;
        margin-top: 40px !important;
    }

    label {
        cursor: pointer;
        margin-top: 30px;
        display: flex;
        color: #A1A1A9;
        max-width: 450px;

        > span {
            margin-left: 8px;
        }
    }

`

const AccountFundedModal = ({ open, onClose, checked, handleCheckboxChange }) => {
    return (
        <Modal
            id='account-funded-modal'
            isOpen={open}
            onClose={onClose}
        >
            <Container>
                <MobileActionSheet/>
                <h2><Translate id='account.createImplicit.post.modal.title'/></h2>
                <div className='sub-title'><Translate id='account.createImplicit.post.modal.descOne'/></div>
                <div className='sub-title'><Translate id='account.createImplicit.post.modal.descTwo'/></div>
                <label>
                    <Checkbox
                        checked={checked}
                        onChange={handleCheckboxChange}
                    />
                    <span><Translate id='account.createImplicit.post.modal.checkbox'/></span>
                </label>
                <FormButton onClick={() => {}}>
                    <Translate id='button.finish' />
                </FormButton>
            </Container>
        </Modal>
    );
}

export default AccountFundedModal