import React from 'react'
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'

import FormButton from '../common/FormButton'
import IconMCopy from '../../images/IconMCopy'

import styled from 'styled-components'

const CustomDiv = styled(`div`)`
    .buttons-row {
        display: flex;

        button {
            width: 250px !important;
        }
        > button:first-child {
            display: none;
        }
    }
    #seed-phrase {
        flex-wrap: wrap;
        user-select: all;

        .single-phrase {
            background: #f8f8f8;
            padding: 9px 12px;
            margin: 0 6px;
            line-height: 48px;
        }
    }

    @media screen and (max-width: 991px) {
        .buttons-row {
            display: block;
            
            button {
                width: 100% !important;
            }
            > button:first-child {
                display: block;
            }
        }
    }
`

const Number = styled(`span`)`
    letter-spacing: 2px;

    ::before {
        content: '${props => props.number || 1}';
        color: #999;
        padding-right: 12px;
        font-size: 12px;
    }
`

const SetupSeedPhraseForm = ({
    seedPhrase,
    handleCopyPhrase,
    match
}) => (
    <CustomDiv>
        <div id='seed-phrase'>
            {seedPhrase.split(' ').map((word, i) => (
                <span className='single-phrase' key={`phrase-${i}`}>
                    <Number number={i + 1} className='h4'>{word} </Number>
                </span>
            ))}
        </div>
        <div className='buttons-row'>
            <FormButton
                onClick={handleCopyPhrase}
                color='seafoam-blue-white'
            >
                <Translate id='button.copyPhrase' />
                <IconMCopy color='#6ad1e3' />
            </FormButton>
            <FormButton
                linkTo={`${match.url}${match.url.substr(-1) === '/' ? '' : '/'}verify`}
                color='blue'
            >
                <Translate id='button.continue' />
            </FormButton>
        </div>
    </CustomDiv>
)

export default withRouter(SetupSeedPhraseForm)
