import React from 'react';
import { Translate } from 'react-localize-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import ClickToCopy from '../common/ClickToCopy';
import FormButton from '../common/FormButton';
import CopyIcon from '../svg/CopyIcon';
import GenerateNewIcon from '../svg/GenerateNewIcon';


const CustomDiv = styled(`div`)`
    .seed-phrase-wrapper {
        box-shadow: 0px 45px 56px rgba(0, 0, 0, 0.07), 0px 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0px 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
        border-radius: 8px;
        padding: 10px;
    }
    &&& {
        .buttons-wrapper {
            border-top: 1px solid #F0F0F1;
            margin: 15px -10px 0 -10px;
            > div {
                padding: 20px 15px 10px 15px;
                display: flex;
                .copy {
                    button {
                        max-width: 130px;
                    }
                }
                button {
                    flex: 1;
                    padding: 5px;
                    height: 40px;
                    margin: 0;
                    svg {
                        margin: 0 8px -3px 0;
                    }
                    &.generate {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
    &&& {
        > button {
            width: 100%;
            margin-top: 45px;
        }
    }
    #seed-phrase {
        flex-wrap: wrap;
        user-select: all;
        display: flex;

        .single-phrase {
            background: #D6EDFF;
            padding: 10px;
            word-break: break-all;
            margin: 5px;
            flex: 1;
            min-width: 90px;

            .h4 {
                color: #005497;
                font-size: 14px;
                font-weight: normal;
            }
        }
    }
`;

const Number = styled(`span`)`
    ::before {
        content: '${props => props.number || 1}';
        color: #2B9AF4;
        padding-right: 8px;
        font-size: 12px;
    }
`;

const SetupSeedPhraseForm = ({
    seedPhrase,
    refreshData,
    onClickContinue,
    hasSeedPhraseRecovery = false
}) => {

    return (
        <CustomDiv translate='no' className='notranslate skiptranslate'>
            <div className='seed-phrase-wrapper'>
                <div id='seed-phrase'>
                    {seedPhrase.split(' ').map((word, i) => (
                        <span className='single-phrase' key={`phrase-${i}`}>
                            <Number number={i + 1} className='h4'>{word} </Number>
                        </span>
                    ))}
                </div>
                <div className='buttons-wrapper'>
                    <div>
                        <ClickToCopy copy={seedPhrase} className='copy'>
                            <FormButton
                                color='gray-blue'
                                className='small'
                            >
                                <CopyIcon color='#A2A2A8' />
                                <Translate id='button.copy' />
                            </FormButton>
                        </ClickToCopy>
                        <FormButton
                            color='gray-blue'
                            className='small generate'
                            onClick={refreshData}
                        >
                            <GenerateNewIcon />
                            <Translate id='button.generateNew' />
                        </FormButton>
                    </div>
                </div>
            </div>
            <FormButton
                disabled={hasSeedPhraseRecovery}
                onClick={onClickContinue}
                color='blue'
                data-test-id="continueToSeedPhraseVerificationButton"
            >
                <Translate id='button.continue' />
            </FormButton>
        </CustomDiv>
    );
};

export default withRouter(SetupSeedPhraseForm);
