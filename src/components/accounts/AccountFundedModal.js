import React from 'react'
import Modal from '../common/modal/Modal'
import MobileActionSheet from '../common/modal/MobileActionSheet'
import Checkbox from '../common/Checkbox'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import FormButton from '../common/FormButton'

const Container = styled.div`
    padding: 15px 0;

    @media (max-width: 360px) {
        padding: 0;
    }

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

const SwapAccountContainer = styled.div`
    position: relative;
    height: 110px;
    width: 200px;
    margin: 0 auto;

    > div {
        padding: 10px 15px;
        border-radius: 8px;
        max-width: 140px;
        position: absolute;

        > span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }

        :first-of-type {
            background-color: #FFEEEF;
            color: #CF8082;
            left: 20%;
            transform: translate(-20%, 0);
        }

        :last-of-type {
            background-color: #C8F6E0;
            color: #005A46;
            left: 85%;
            transform: translate(-85%, 0);
            top: 33px;

            > svg {
                position: absolute;
                left: -29px;
                top: 10px;
            }
        }

        > div {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: -14px;
            right: -15px;

            &.implicit {
                border: 2px solid #FFBDBE;

                > svg {
                    margin: 0 0 1px 1px;
                }
            }

            &.account-id {
                border: 2px solid #90E9C5;

                > svg {
                    margin: 1px 0 0 1px;
                }
            }
        }
    }
`

const SwapAccountGraphic = ({ implicitAccountId, accountId }) => {
    return (
        <SwapAccountContainer>
            <div>
                <span>{implicitAccountId}</span>
                <div className='implicit'>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                            <path d="M2.32959 4.71051H3.66292H14.3296" stroke="#FF585D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.66296 4.71051V3.37718C5.66296 3.02355 5.80344 2.68442 6.05349 2.43437C6.30354 2.18432 6.64268 2.04384 6.9963 2.04384H9.66296C10.0166 2.04384 10.3557 2.18432 10.6058 2.43437C10.8558 2.68442 10.9963 3.02355 10.9963 3.37718V4.71051M12.9963 4.71051V14.0438C12.9963 14.3975 12.8558 14.7366 12.6058 14.9867C12.3557 15.2367 12.0166 15.3772 11.663 15.3772H4.9963C4.64268 15.3772 4.30354 15.2367 4.05349 14.9867C3.80344 14.7366 3.66296 14.3975 3.66296 14.0438V4.71051H12.9963Z" stroke="#FF585D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6.99622 8.04384V12.0438" stroke="#FF585D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.66296 8.04384V12.0438" stroke="#FF585D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                            <clipPath id="clip0">
                            <rect width="16" height="16" fill="white" transform="translate(0.32959 0.71051)"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
            <div>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1401 10.4829L20.1401 15.4829L15.1401 20.4829" stroke="#2B9AF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.14014 4.48291V11.4829C4.14014 12.5438 4.56156 13.5612 5.31171 14.3113C6.06185 15.0615 7.07927 15.4829 8.14014 15.4829H20.1401" stroke="#2B9AF4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{accountId}</span>
                <div className='account-id'>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3496 4.80005L6.01632 12.1334L2.68298 8.80005" stroke="#008D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </SwapAccountContainer>
    )
}

const AccountFundedModal = ({ open, onClose, checked, handleCheckboxChange, accountId, implicitAccountId }) => {
    return (
        <Modal
            id='account-funded-modal'
            isOpen={open}
            onClose={onClose}
        >
            <Container>
                <MobileActionSheet/>
                {implicitAccountId && accountId && 
                    <SwapAccountGraphic accountId={accountId} implicitAccountId={implicitAccountId}/>
                }
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