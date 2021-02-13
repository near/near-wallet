import React from 'react'
import Modal from "../common/modal/Modal"
import FormButton from '../common/FormButton'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        text-align: center;
        margin-top: 20px;
    }

    .row {
        width: 100%;
        max-width: 400px;
        margin: 40px auto;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;

        border-top: 1px solid #F0F0F1;
        :last-of-type {
            border-bottom: 1px solid #F0F0F1;
        }

        span {
            :first-of-type {
                color: #A2A2A8;
            }
        }

        .amount {
            font-weight: 600;
        }

        .status {
            display: flex;
            align-items: center;
            span {
                height: 7px;
                width: 7px;
                border-radius: 50%;
                background-color: #4DD5A6;
                margin-right: 5px;
            }
        }
    }

    button {
        &.gray-blue {
            width: 100% !important;
            max-width: 400px;
        }
    }

`

const ActivityDetailModal = ({ open, onClose }) => {
    return (
        <Modal
            id='instructions-modal'
            isOpen={open}
            onClose={onClose}
            closeButton
        >
            <StyledContainer>
                <h2>Sent NEAR</h2>
                <div className='row'>
                    <div className='item'>
                        <span>Amount</span>
                        <span className='amount'>10.123 NEAR</span>
                    </div>
                    <div className='item'>
                        <span>Sent to</span>
                        <span>dtama.near</span>
                    </div>
                    <div className='item'>
                        <span>Date & time</span>
                        <span>1/9/2021 10.09 PM</span>
                    </div>
                    <div className='item'>
                        <span>Status</span>
                        <span className='status'><span/>Complete</span>
                    </div>
                </div>
                <FormButton color='gray-blue' onClick={() => {}}>
                    <Translate id='button.viewOnExplorer'/>
                </FormButton>
            </StyledContainer>
        </Modal>
    )
}

export default ActivityDetailModal