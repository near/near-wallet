import React, { useState } from 'react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import AlertRoundedIcon from '../../svg/AlertRoundedIcon.js'
import NearCircleIcon from '../../svg/NearCircleIcon.js'
import FormButton from '../../common/FormButton'
import Modal from '../../common/modal/Modal'
import MobileActionSheet from '../../common/modal/MobileActionSheet'

const Container = styled.div`
    &&&& {
        background-color: #FFF0DE;
        color: #A15600;
        border-radius: 4px;
        padding: 10px 16px 10px 10px;
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-top: 10px;
        line-height: normal;

    svg {
        margin-right: 8px;
    }

    button {
        width: auto !important;
        height: auto !important;
        margin: 0 0 0 auto !important;
        text-transform: unset;
        color: #452500;
        font-size: 13px;
        font-weigth: 400;
        white-space: nowrap;

        :hover, :focus {
            color: #452500;
        }
    }
}
`

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 500px) {
        padding: 20px 55px;
    }

    h2 {
        text-align: center;
        margin-top: 25px;
    }

    p {
        :first-of-type {
            margin-top: 40px;
        }
    }
`

export default function StakingRewardsBanner() {
    const [info, setInfo] = useState(false);
    
    return (
        <Container>
            <AlertRoundedIcon/>
            <Translate id='staking.balanceBox.unclaimed.unavailable.title' />
            <FormButton className='link' onClick={() => setInfo(true)}>
                <Translate id='staking.balanceBox.unclaimed.unavailable.cta' />
            </FormButton>
            {info &&
                <Modal
                    id='staking-rewards-modal'
                    isOpen={info}
                    onClose={() => setInfo(false)}
                    closeButton='desktop'
                >
                    <ModalContainer>
                        <MobileActionSheet/>
                        <NearCircleIcon/>
                        <h2><Translate id='staking.balanceBox.unclaimed.unavailable.modalTitle' /></h2>
                        <p>
                            <Translate id='staking.balanceBox.unclaimed.unavailable.modalDescOne' />
                        </p>
                        <p>
                            <Translate id='staking.balanceBox.unclaimed.unavailable.modalDescTwo' />
                        </p>
                        <FormButton color='gray-white' id='close-button'>
                            <Translate id='button.dismiss'/>
                        </FormButton>
                    </ModalContainer>
                </Modal>
            }
        </Container>
    )
}