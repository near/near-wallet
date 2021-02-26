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

const Container = styled.div`
    background-color: black;
    border-radius: 32px;
    padding: 20px;
    width: 100%;
    position: relative;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #D5D4D8;
    font-size: 15px;

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

        @media (max-width: 991px) {
            button {
                &.link {
                    display: none !important;
                }
            }
        }

        @media (min-width: 992px) {
            button {
                width: auto !important;
                padding: 12px 25px;
                height: auto !important;

                &.link {
                    color: white !important;
                    text-decoration: none !important;
                    margin-left: 30px !important;

                    :hover {
                        text-decoration: underline !important;
                    }
                }
            }
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

    @media (min-width: 992px) {
        text-align: left;
        align-items: flex-start;
        border-radius: 8px;
        padding: 30px;
        overflow: hidden;

        h2 {
            align-self: flex-start !important;
            margin-bottom: 5px !important;
        }

        .apps-wrapper {
            position: absolute;
            right: 107px;
            top: -42px;

            img {
                transform: scale(1);

                :nth-of-type(1) {
                    top: -68px;
                    left: -39px;
                }
                :nth-of-type(2) {
                    top: -80px;
                    right: -85px;
                }
                :nth-of-type(3) {
                    top: -21px;
                    left: -81px;
                }
                :nth-of-type(4) {
                    top: -28px;
                    left: -10px;
                }
                :nth-of-type(5) {
                    top: -20px;
                    left: 80px;
                }
                :nth-of-type(6) {
                    top: 11px;
                    left: 32px;
                    opacity: 0.3;
                }
            }
        }

        .desc {
            max-width: 250px;
            line-height: 150%;
            margin-bottom: 20px;
        }
    }
`

const ExploreApps = ({ onClick }) => {
    return (
        <Container>
            <CloseButton onClick={onClick} device='tablet'/>
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
                <FormButton linkTo='https://awesomenear.com' color='white-blue' trackingId='Click explore apps button'><Translate id='exploreApps.button' /></FormButton>
                <FormButton onClick={onClick} color='link' trackingId='Click explore apps dismiss'><Translate id='button.dismiss' /></FormButton>
            </div>
        </Container>
    )
}

export default ExploreApps