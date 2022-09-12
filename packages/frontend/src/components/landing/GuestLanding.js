import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { COLORS } from '../../utils/theme';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import LandingBackground from './LandingBackground';

const StyledContainer = styled.div`
    &&& {
        margin: 35px 5px 0 5px;
        position: relative;
        text-align: center;

        @media (max-width: 767px) {
            margin: 0;
            overflow: hidden;
            margin-top: -13px;
        }

        svg {
            opacity: 0.4;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            z-index: -1;

            @media (max-width: 992px) {
                top: -120px;
            }

            @media (max-width: 470px) {
                top: -86px;
                width: 900px;
                left: unset;
            }
        }

        .small-centered {
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            h1 {
                color: ${COLORS.white};
            }
            h2 {
                color: ${COLORS.lightText};
            }
        }

        h1 {
            font-weight: 600;
        }

        h3 {
            font-weight: 400 !important;
            line-height: 150%;
            color: ${COLORS.white};

            span {
                span {
                    font-weight: 500;
                }
            }

            @media (max-width: 767px) {
                font-size: 16px !important;
            }
        }

        .buttons {
            margin: 30px 0 60px 0;
            display: flex;
            flex-direction: column;
            width: 100%;

            align-items: center;
            justify-content: center;
            z-index: 1;

            .link {
                text-decoration: none;
                padding: 0;
                :hover {
                    background-color: transparent;
                    text-decoration: underline;
                }
            }

            span {
                margin: 20px;
            }


            button {
                width: 100%;
                font-size: 20px;
            }
        }

        .img-wrapper {
            min-height: 300px;

            @media (min-width: 768px) {
                min-height: 600px;
            }
        }

        img {
            margin-top: 65px;
            margin-bottom: 50px;
            width: 500px;
            height: auto;

            @media (min-width: 768px) {
                width: 675px;
                margin-bottom: 75px;
            }
        }

        .email-subscribe {
            margin-top: -140px;
            margin-bottom: 50px;
            padding-top: 80px;

            @media (max-width: 767px) {
                margin-bottom: 0;
                margin-top: -100px;
            }
        }
    }
`;

const GuestLanding = () => (
    <StyledContainer>
        <LandingBackground/>
        <Container className='small-centered'>
            <h1><Translate id='landing.title' /></h1>
            <h3><Translate id='landing.desc' /></h3>
            <div className='buttons'>
                <FormButton
                    linkTo="/create"
                    trackingId="Click create account button"
                    data-test-id="landingPageCreateAccount"
                    color='light-green'
                >
                    <Translate id="button.createAccount" />
                </FormButton>
                <FormButton
                    data-test-id="homePageImportAccountButton"
                    linkTo="/recover-account"
                    trackingId="Click import existing link"
                    color='light-green'
                >
                    <Translate id="button.importAccount" />
                </FormButton>
            </div>
        </Container>
    </StyledContainer>
);

export default GuestLanding;
