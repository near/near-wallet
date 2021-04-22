import React from 'react'
import Modal from '../common/modal/Modal'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import NearGiftIcons from '../svg/NearGiftIcons'
import Balance from '../common/Balance'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 30px 0;

    h3 {
        margin: 40px 0 0 0;
    }

    .near-balance {
        color: #0072CE;
        font-weight: 600;
        border: 1px solid #D6EDFF;
        border-radius: 4px;
        padding: 6px 15px;
        background-color: #F0F9FF;
        margin: 30px 0;
    }

    .desc {
        color: #72727A;
    }

`

const NearDropSuccessModal = ({ open, onClose }) => {
    return (
        <Modal
            id='near-drop-success-modal'
            isOpen={open}
            onClose={onClose}
            modalSize='sm'
            closeButton={true}
        >
            <Container>
                <NearGiftIcons/>
                <h3><Translate id='linkdropLanding.modal.title'/></h3>
                <div className='near-balance'>
                    <Balance amount={'1000000823923829839823000000'} symbol='near'/>
                </div>
                <div className='desc'>
                    <Translate id='linkdropLanding.modal.desc'/>
                </div>
            </Container>
        </Modal>
    );
}

export default NearDropSuccessModal