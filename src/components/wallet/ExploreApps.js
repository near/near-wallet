import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import CloseButton from '../common/modal/CloseButton'
import HashRushLogo from '../../images/hash-rush-logo.svg'
import ParasLogo from '../../images/paras-logo.svg'
import ZedLogo from '../../images/zed-logo.svg'
import MintbaseLogo from '../../images/mintbase-logo.svg'
import FluxLogo from '../../images/flux-logo.svg'
import BerryClubLogo from '../../images/berryclub-logo.svg'
import { EXPLORE_APPS_URL } from '/utils/wallet'

const Container = styled.div`
    background-color: black;
    border-radius: 8px;
    padding: 20px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #D5D4D8;
    font-size: 15px;
    margin-bottom: 50px;

    h2 {
        color: white !important;
        align-self: center !important;
        margin: -5px 0 15px 0 !important;
    }

    button {
        svg {
            path {
                stroke: white;
            }
        }
    }

    .buttons {
        width: 100%;
        button {
            width: 100% !important;
        }
    }

    .apps-wrapper {
        position: relative;
        height: 150px;
        margin: 30px auto 25px auto;
        max-width: 75%;

        > div {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    img {
        position: absolute;
        transform: scale(1.2);

        :nth-of-type(1) {
            top: -65px;
            left: -50px;
        }
        :nth-of-type(2) {
            top: -80px;
            right: -85px;
        }
        :nth-of-type(3) {
            top: -10px;
            left: -110px;
        }
        :nth-of-type(4) {
            top: -20px;
            left: -20px;
        }
        :nth-of-type(5) {
            top: -20px;
            left: 80px;
        }
        :nth-of-type(6) {
            top: 25px;
            left: 30px;
            opacity: 0.3;
        }
    }
`

const ExploreApps = ({ onClick }) => {
    return (
        <Container>
            <CloseButton onClick={onClick}/>
            <div className='apps-wrapper'>
                <div>
                    <img src={HashRushLogo} alt='Hash Rush'/>
                    <img src={FluxLogo} alt='Flux'/>
                    <img src={ParasLogo} alt='Paras'/>
                    <img src={ZedLogo} alt='Zed'/>
                    <img src={MintbaseLogo} alt='Mintbase'/>
                    <img src={BerryClubLogo} alt='Berryclub'/>
                </div>
            </div>
            <h2><Translate id='exploreApps.title' /></h2>
            <div className='desc'><Translate id='exploreApps.desc' /></div>
            <div className='buttons'>
                <FormButton linkTo={EXPLORE_APPS_URL} color='white-blue' trackingId='Click explore apps button'><Translate id='exploreApps.button' /></FormButton>
            </div>
        </Container>
    )
}

export default ExploreApps