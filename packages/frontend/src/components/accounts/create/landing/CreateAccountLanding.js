import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Container from '../../../common/styled/Container.css';
import ArrowIcon from '../../../svg/ArrowIcon';
import CreateAccountTerms from '../CreateAccountTerms';

const StyledContainer = styled(Container)`
    &&& {
        > button {
            display: block;
    
            &.link {
                border-bottom: 1px solid #0072ce;
                margin: 5px 0 15px 0;
                svg {
                    transform: rotate(180deg);
                    margin: 0 0 -2px 4px;
                }
    
                :hover {
                    border-bottom: 1px solid transparent;
                    text-decoration: none;
                }
            }

            &.primary {
                width: 100%;
            }
        }

        .create-account-terms {
            margin-top: 30px;
        }

        .existing-account {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 30px;

            button {
                &.link {
                    color: #72727a;
                    font-size: 14px;
                }
            }
        }
    }
`;

export function CreateAccountLanding() {
    return (
        <StyledContainer className='small-centered border'>
            <h1><Translate id='createAccount.landing.title' /></h1>
            <h2><Translate id='createAccount.landing.descOne' /></h2>
            <h2><Translate id='createAccount.landing.descTwo' /></h2>
            <FormButton
                linkTo='https://near.org'
                className='link normal'
            >
                <Translate id='button.learnMoreAboutNear' />
                <ArrowIcon />
            </FormButton>
            <FormButton
                linkTo='/set-recovery-implicit-account'
                className='primary'
            >
                <Translate id='button.getStarted' />
            </FormButton>
            <CreateAccountTerms />
            <div className='existing-account'>
                <Translate id='createAccount.alreadyHaveAnAccount' />
                <FormButton
                    linkTo='/recover-account'
                    className='link normal underline'
                >
                    <Translate id='createAccount.recoverItHere' />
                </FormButton>
            </div>
        </StyledContainer>
    );
}