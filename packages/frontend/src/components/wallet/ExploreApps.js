import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { EXPLORE_APPS_URL, EXPLORE_DEFI_URL } from '../../config';
import BerryClubLogo from '../../images/berryclub-logo.svg';
import FluxLogo from '../../images/flux-logo.svg';
import HashRushLogo from '../../images/hash-rush-logo.svg';
import MintbaseLogo from '../../images/mintbase-logo.svg';
import ParasLogo from '../../images/paras-logo.svg';
import ZedLogo from '../../images/zed-logo.svg';
import FormButton from '../common/FormButton';

const Container = styled.div`
    && {
        background-color: black;
        border-radius: 8px;
        padding: 24px;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #d5d4d8;
        font-size: 14px;
        margin-bottom: 50px;

        h2 {
            color: white !important;
            align-self: center !important;
            margin: -5px 0 15px 0 !important;
        }

        .desc {
            margin-bottom: 16px;
        }

        .buttons {
            display: flex;
            width: 100%;
            justify-content: stretch;
            align-items: stretch;

            button {
                width: 100%;
            }

            button:first-child {
                margin-right: 16px;
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
            }
        }
    }
`;

const ExploreApps = () => {
    return (
        <Container>
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
            <h2>
                <Translate id='exploreApps.title'/>
            </h2>
            <div className='desc'>
                <Translate id='exploreApps.desc'/>
            </div>
            <div className='buttons'>
                <FormButton
                    linkTo={EXPLORE_APPS_URL}
                    color='dark-gray-light-blue'
                    trackingId='Click explore apps button'
                >
                    <Translate id='exploreApps.exploreApps'/>
                </FormButton>
                <FormButton
                    linkTo={EXPLORE_DEFI_URL}
                    color='dark-gray-light-blue'
                    trackingId='Click explore defi button'
                >
                    <Translate id='exploreApps.exploreDeFi'/>
                </FormButton>
            </div>
        </Container>
    );
};

export default ExploreApps;
